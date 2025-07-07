import React from 'react';
import styled, { keyframes } from 'styled-components';

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

const fillBar = keyframes`
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
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
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  
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

const TotalVotes = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 25px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%);
  border-radius: 10px;
  border: 1px solid rgba(214, 51, 132, 0.2);
  font-weight: 600;
`;

const ResultItem = styled.div<{ index: number }>`
  margin-bottom: 20px;
  animation: ${fadeIn} 0.6s ease-out ${props => 0.5 + props.index * 0.1}s both;
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const OptionText = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const VoteInfo = styled.span`
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  background: #f0f0f0;
  border-radius: 20px;
  height: 25px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressBar = styled.div<{ percentage: number; isTop: boolean }>`
  height: 100%;
  background: ${props => props.isTop 
    ? 'linear-gradient(45deg, #ff6b6b 0%, #d63384 50%, #ff6b6b 100%)'
    : 'linear-gradient(45deg, #ffb3b3 0%, #ff8e8e 100%)'};
  border-radius: 20px;
  transition: all 0.8s ease-out;
  animation: ${fillBar} 1.5s ease-out ${props => 0.8}s both;
  width: ${props => props.percentage}%;
  position: relative;
  
  &::after {
    content: '${props => props.percentage.toFixed(1)}%';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    font-weight: bold;
    font-size: 0.85rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  background: rgba(214, 51, 132, 0.05);
  border-radius: 15px;
  border: 2px dashed rgba(214, 51, 132, 0.3);
`;

const Crown = styled.span`
  margin-left: 10px;
  font-size: 1.2rem;
`;

interface VotingResults {
  results: Array<{
    id: number;
    text: string;
    votes: number;
    percentage: number;
  }>;
  total_votes: number;
}

interface ResultsComponentProps {
  results: VotingResults | null;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results }) => {
  if (!results) {
    return (
      <Container>
        <Title>📊 Resultados en Vivo 📊</Title>
        <NoResults>
          💭 Cargando resultados...
        </NoResults>
      </Container>
    );
  }

  const { results: votingResults, total_votes } = results;
  const topResult = votingResults.length > 0 ? votingResults[0] : null;

  return (
    <Container>
      <Title>📊 Resultados en Vivo 📊</Title>
      
      <TotalVotes>
        💖 Total de votos: {total_votes}
      </TotalVotes>

      {votingResults.length === 0 ? (
        <NoResults>
          🗳️ Aún no hay votos registrados.<br />
          ¡Sé el primero en votar!
        </NoResults>
      ) : (
        votingResults.map((result, index) => (
          <ResultItem key={result.id} index={index}>
            <OptionHeader>
              <OptionText>
                {result.text}
                {index === 0 && topResult && topResult.votes > 0 && (
                  <Crown>👑</Crown>
                )}
              </OptionText>
              <VoteInfo>
                {result.votes} voto{result.votes !== 1 ? 's' : ''}
              </VoteInfo>
            </OptionHeader>
            <ProgressBarContainer>
              <ProgressBar 
                percentage={result.percentage} 
                isTop={index === 0 && result.votes > 0}
              />
            </ProgressBarContainer>
          </ResultItem>
        ))
      )}
    </Container>
  );
};

export default ResultsComponent;
