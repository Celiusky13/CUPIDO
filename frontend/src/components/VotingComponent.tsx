import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 400px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-family: 'Dancing Script', cursive;
  font-size: 2.5rem;
  color: #d63384;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

const OptionButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 15px 20px;
  margin-bottom: 15px;
  border: none;
  border-radius: 15px;
  background: ${props => props.disabled 
    ? 'linear-gradient(135deg, #ccc 0%, #999 100%)' 
    : 'linear-gradient(135deg, #ff6b6b 0%, #d63384 100%)'};
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    ${props => !props.disabled && `
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(214, 51, 132, 0.4);
      animation: ${pulse} 1s ease-in-out infinite;
    `}
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

const StatusMessage = styled.div<{ success?: boolean }>`
  text-align: center;
  padding: 15px;
  margin-top: 20px;
  border-radius: 10px;
  background: ${props => props.success 
    ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' 
    : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.success ? '#c3e6cb' : '#f5c6cb'};
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease-out;
`;

const SessionInfo = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(214, 51, 132, 0.1);
  border-radius: 8px;
  border-left: 4px solid #d63384;
`;

interface VotingOption {
  id: number;
  text: string;
}

interface VotingComponentProps {
  options: VotingOption[];
  onVote: (optionId: number) => void;
  hasVoted: boolean;
  sessionId: string;
}

const VotingComponent: React.FC<VotingComponentProps> = ({
  options,
  onVote,
  hasVoted,
  sessionId
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [voteMessage, setVoteMessage] = useState('');

  const handleVote = async (optionId: number) => {
    if (hasVoted || isVoting) return;
    
    setIsVoting(true);
    try {
      await onVote(optionId);
      setVoteMessage('¡Tu voto ha sido registrado con amor! 💕');
    } catch (error) {
      setVoteMessage('Error al votar. Inténtalo de nuevo.');
    }
    setIsVoting(false);
  };

  return (
    <Container>
      <Title>💘 ¡Vota Aquí! 💘</Title>
      
      {sessionId && (
        <SessionInfo>
          🆔 Tu sesión: {sessionId.substring(0, 8)}...
        </SessionInfo>
      )}
      
      {hasVoted ? (
        <StatusMessage success>
          ✨ ¡Gracias por votar! Tu voto ya está registrado ✨
        </StatusMessage>
      ) : (
        <>
          {options.map((option, index) => (
            <OptionButton
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || isVoting}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {option.text}
            </OptionButton>
          ))}
          
          {isVoting && (
            <StatusMessage>
              💖 Registrando tu voto...
            </StatusMessage>
          )}
          
          {voteMessage && !hasVoted && (
            <StatusMessage success={voteMessage.includes('registrado')}>
              {voteMessage}
            </StatusMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default VotingComponent;
