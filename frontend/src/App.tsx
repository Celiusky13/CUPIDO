import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import VotingComponent from './components/VotingComponent';
import ResultsComponent from './components/ResultsComponent';

const API_BASE_URL = 'http://187.33.157.136:5000';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;600&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ffb3b3 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }
`;

const heartFloat = keyframes`
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(255,255,255,0.3));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Title = styled.h1`
  font-family: 'Dancing Script', cursive;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const FloatingHeart = styled.div<{ delay: number; left: number }>`
  position: fixed;
  bottom: -50px;
  left: ${props => props.left}%;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.7);
  animation: ${heartFloat} 8s linear infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
`;

interface VotingOption {
  id: number;
  text: string;
}

interface VotingResults {
  results: Array<{
    id: number;
    text: string;
    votes: number;
    percentage: number;
  }>;
  total_votes: number;
}

function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [votingOptions, setVotingOptions] = useState<VotingOption[]>([]);
  const [results, setResults] = useState<VotingResults | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [hearts, setHearts] = useState<Array<{ id: number; delay: number; left: number }>>([]);

  useEffect(() => {
    // Crear sesión de usuario
    const createSession = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/session`);
        const newSessionId = response.data.session_id;
        setSessionId(newSessionId);
        
        // Verificar si ya ha votado
        const hasVotedResponse = await axios.get(`${API_BASE_URL}/api/has-voted/${newSessionId}`);
        setHasVoted(hasVotedResponse.data.has_voted);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    };

    // Obtener opciones de votación
    const fetchVotingOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/voting-options`);
        setVotingOptions(response.data);
      } catch (error) {
        console.error('Error fetching voting options:', error);
      }
    };

    // Obtener resultados iniciales
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/results`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    createSession();
    fetchVotingOptions();
    fetchResults();

    // Configurar WebSocket
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.on('vote_update', (data: VotingResults) => {
      setResults(data);
    });

    // Crear corazones flotantes
    const heartInterval = setInterval(() => {
      setHearts(prev => [
        ...prev.slice(-10), // Mantener solo los últimos 10 corazones
        {
          id: Date.now(),
          delay: 0,
          left: Math.random() * 100
        }
      ]);
    }, 2000);

    return () => {
      newSocket.disconnect();
      clearInterval(heartInterval);
    };
  }, []);

  const handleVote = async (optionId: number) => {
    if (!sessionId || hasVoted) return;

    try {
      await axios.post(`${API_BASE_URL}/api/vote`, {
        session_id: sessionId,
        option_id: optionId
      });
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error al votar. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        {hearts.map(heart => (
          <FloatingHeart key={heart.id} delay={heart.delay} left={heart.left}>
            💖
          </FloatingHeart>
        ))}
        
        <Header>
          <Logo src={`${API_BASE_URL}/static/cupido-logo.png`} alt="Cupido Logo" />
          <Title>💕 Cupido Votos 💕</Title>
          <Subtitle>Vota por tu opción favorita del amor</Subtitle>
        </Header>

        <MainContent>
          <VotingComponent
            options={votingOptions}
            onVote={handleVote}
            hasVoted={hasVoted}
            sessionId={sessionId}
          />
          
          <ResultsComponent results={results} />
        </MainContent>
      </Container>
    </>
  );
}

export default App;
