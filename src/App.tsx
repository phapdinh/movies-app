import { QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import MovieApp from './MovieApp';
import { queryClient } from './api/baseConfig';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MovieApp />
    </QueryClientProvider>
  )
}

export default App
