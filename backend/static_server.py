from flask import Flask, send_from_directory, send_file
import os

# Configurar Flask para servir archivos estáticos de React
def configure_static_serving(app):
    """Configurar Flask para servir la aplicación React construida"""
    
    # Ruta al directorio build de React
    build_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build')
    static_dir = os.path.join(build_dir, 'static')
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path):
        """Servir la aplicación React"""
        if path != "" and os.path.exists(os.path.join(build_dir, path)):
            return send_from_directory(build_dir, path)
        else:
            return send_file(os.path.join(build_dir, 'index.html'))
    
    @app.route('/static/<path:filename>')
    def serve_react_static(filename):
        """Servir archivos estáticos de React"""
        return send_from_directory(static_dir, filename)

if __name__ == '__main__':
    app = Flask(__name__)
    configure_static_serving(app)
    app.run(host='0.0.0.0', port=3000, debug=False)
