import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import './App.css';
import MovieApp from './MovieApp';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MovieApp />
    </QueryClientProvider>
  )
}

export default App
