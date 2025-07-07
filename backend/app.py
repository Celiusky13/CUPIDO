from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import uuid
import sqlite3
import json
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cupido-love-secret-2025'
CORS(app, origins=["http://187.33.157.136:3000", "http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins=["http://187.33.157.136:3000", "http://localhost:3000"])

# Base de datos SQLite
def init_db():
    conn = sqlite3.connect('cupido_voting.db')
    cursor = conn.cursor()
    
    # Tabla de sesiones de usuario
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de opciones de votación
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS voting_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            option_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de votos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            option_id INTEGER NOT NULL,
            voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (option_id) REFERENCES voting_options (id),
            UNIQUE(session_id)
        )
    ''')
    
    # Insertar opciones de votación por defecto
    cursor.execute('SELECT COUNT(*) FROM voting_options')
    if cursor.fetchone()[0] == 0:
        default_options = [
            "💕 Romance Clásico",
            "💘 Amor Moderno", 
            "💖 Cariño Eterno",
            "💝 Pasión Verdadera"
        ]
        for option in default_options:
            cursor.execute('INSERT INTO voting_options (option_text) VALUES (?)', (option,))
    
    conn.commit()
    conn.close()

@app.route('/api/session', methods=['POST'])
def create_session():
    """Crear una nueva sesión de usuario"""
    session_id = str(uuid.uuid4())
    
    conn = sqlite3.connect('cupido_voting.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO user_sessions (session_id) VALUES (?)', (session_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'session_id': session_id})

@app.route('/api/voting-options', methods=['GET'])
def get_voting_options():
    """Obtener todas las opciones de votación"""
    conn = sqlite3.connect('cupido_voting.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, option_text FROM voting_options')
    options = [{'id': row[0], 'text': row[1]} for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(options)

@app.route('/api/vote', methods=['POST'])
def vote():
    """Registrar un voto"""
    data = request.get_json()
    session_id = data.get('session_id')
    option_id = data.get('option_id')
    
    if not session_id or not option_id:
        return jsonify({'error': 'Faltan datos requeridos'}), 400
    
    conn = sqlite3.connect('cupido_voting.db')
    cursor = conn.cursor()
    
    # Verificar que la sesión existe
    cursor.execute('SELECT id FROM user_sessions WHERE session_id = ?', (session_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Sesión inválida'}), 400
    
    # Verificar que la opción existe
    cursor.execute('SELECT id FROM voting_options WHERE id = ?', (option_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Opción inválida'}), 400
    
    # Verificar si ya ha votado
    cursor.execute('SELECT id FROM votes WHERE session_id = ?', (session_id,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Ya has votado'}), 400
    
    # Registrar el voto
    cursor.execute('INSERT INTO votes (session_id, option_id) VALUES (?, ?)', (session_id, option_id))
    conn.commit()
    conn.close()
    
    # Emitir actualización de resultados en tiempo real
    results = get_voting_results()
    socketio.emit('vote_update', results)
    
    return jsonify({'message': '¡Voto registrado con amor! 💕'})

@app.route('/api/results', methods=['GET'])
def voting_results():
    """Obtener resultados de votación"""
    results = get_voting_results()
    return jsonify(results)

def get_voting_results():
    """Función auxiliar para obtener resultados"""
    conn = sqlite3.connect('cupido_voting.db')
    cursor = conn.cursor()
    
    query = '''
        SELECT vo.id, vo.option_text, COUNT(v.id) as vote_count
        FROM voting_options vo
        LEFT JOIN votes v ON vo.id = v.option_id
        GROUP BY vo.id, vo.option_text
        ORDER BY vote_count DESC
    '''
    
    cursor.execute(query)
    results = []
    total_votes = 0
    
    for row in cursor.fetchall():
        vote_count = row[2]
        total_votes += vote_count
        results.append({
            'id': row[0],
            'text': row[1],
            'votes': vote_count
        })
    
    # Calcular porcentajes
    for result in results:
        if total_votes > 0:
            result['percentage'] = round((result['votes'] / total_votes) * 100, 1)
        else:
            result['percentage'] = 0
    
    conn.close()
    
    return {
        'results': results,
        'total_votes': total_votes
    }

@app.route('/api/has-voted/<session_id>', methods=['GET'])
def has_voted(session_id):
    """Verificar si una sesión ya ha votado"""
    conn = sqlite3.connect('cupido_voting.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM votes WHERE session_id = ?', (session_id,))
    has_voted = cursor.fetchone() is not None
    conn.close()
    
    return jsonify({'has_voted': has_voted})

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Servir archivos estáticos"""
    return send_from_directory('static', filename)

@socketio.on('connect')
def on_connect():
    """Cliente conectado"""
    print('Cliente conectado')
    results = get_voting_results()
    emit('vote_update', results)

@socketio.on('disconnect')
def on_disconnect():
    """Cliente desconectado"""
    print('Cliente desconectado')

if __name__ == '__main__':
    init_db()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
