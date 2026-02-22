import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieApp from './MovieApp';
import * as api from './api';

// Mock the API module
vi.mock('./api');

// Mock the components
vi.mock('./components/Loader/Loader', () => ({
  default: () => <div>Loading...</div>,
}));


describe('MovieApp Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MovieApp />
      </QueryClientProvider>
    );
  };

  it('should render loading message while fetching bearer token', () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);

    renderComponent();
    expect(screen.getByText(/Welcome to movie app/i)).toBeInTheDocument();
  });

  it('should render search input field', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: {
        data: [
          { id: 1, title: 'Action' },
          { id: 2, title: 'Drama' },
        ],
      },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: {
        data: [],
        totalPages: 0,
      },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
  });

  it('should handle search input change', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: { data: [], totalPages: 0 },
    } as any);

    renderComponent();

    await waitFor(() => {
      const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
      expect(searchInput).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    await userEvent.type(searchInput, 'Inception');

    expect(searchInput.value).toBe('Inception');
  });

  it('should render genre selector with genres', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: {
        data: [
          { id: 1, title: 'Action' },
          { id: 2, title: 'Drama' },
        ],
      },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: { data: [], totalPages: 0 },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('genre-select')).toBeInTheDocument();
    });
  });

  it('should render search button', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: { data: [], totalPages: 0 },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });
  });

  it('should display movies when data is fetched', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: {
        data: [
          { id: 1, title: 'Inception', rating: 8.8, posterUrl: 'url1' },
          { id: 2, title: 'Interstellar', rating: 8.6, posterUrl: 'url2' },
        ],
        totalPages: 1,
      },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      const movieCards = screen.getAllByTestId('movie-card');
      expect(movieCards).toHaveLength(2);
    });
  });

  it('should display movie count', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: {
        data: [
          { id: 1, title: 'Movie1', rating: 8, posterUrl: 'url1' },
          { id: 2, title: 'Movie2', rating: 7, posterUrl: 'url2' },
        ],
        totalPages: 1,
      },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/Found 2 movies/i)).toBeInTheDocument();
    });
  });

  it('should display "No movies found" when search returns empty', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: { data: [], totalPages: 1 },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/No movies found/i)).toBeInTheDocument();
    });
  });

  it('should show pagination when there are multiple pages', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: {
        data: [{ id: 1, title: 'Movie1', rating: 8, posterUrl: 'url1' }],
        totalPages: 3,
      },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('movie-pagination')).toBeInTheDocument();
    });
  });

  it('should handle bearer token error', async () => {
    vi.mocked(api.getBearerToken).mockRejectedValue(new Error('Token error'));
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: { data: [], totalPages: 0 },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Error setting Movies Apps/i)).toBeInTheDocument();
    });
  });

  it('should handle movie search error', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockRejectedValue(new Error('Search error'));

    renderComponent();

    await waitFor(() => {
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Error fetching movies/i)).toBeInTheDocument();
    });
  });

  it('should call getMovies when search button is clicked', async () => {
    const getMoviesMock = vi.mocked(api.getMovies);
    getMoviesMock.mockResolvedValue({
      data: { data: [], totalPages: 0 },
    } as any);

    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(getMoviesMock).toHaveBeenCalled();
    });
  });

  it('should update search term when typing in search input', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);
    vi.mocked(api.getMovies).mockResolvedValue({
      data: { data: [], totalPages: 0 },
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    await userEvent.type(searchInput, 'Test Movie');

    expect(searchInput.value).toBe('Test Movie');
  });

  it('should show loading message when fetching movies', async () => {
    vi.mocked(api.getBearerToken).mockResolvedValue({} as any);
    vi.mocked(api.getMovieGenres).mockResolvedValue({
      data: { data: [] },
    } as any);

    // Mock a slow request
    vi.mocked(api.getMovies).mockImplementation(
      () => new Promise(() => { }) // Never resolves
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });
});
