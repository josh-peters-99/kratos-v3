import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../lib/api/workouts';

jest.mock('../lib/api/workouts', () => ({
  fetchWorkouts: jest.fn(),
  createWorkout: jest.fn(),
  updateWorkout: jest.fn(),
  deleteWorkout: jest.fn(),
}));

describe('Workouts API', () => {
  beforeEach(() => {
    // Reset mock data before each test
    jest.clearAllMocks();
  });

  it('should fetch workouts', async () => {
    // Set up a mock response for fetchWorkouts
    fetchWorkouts.mockResolvedValue([{ id: 1, name: 'Workout 1' }, { id: 2, name: 'Workout 2' }]);

    const workouts = await fetchWorkouts();

    expect(workouts).toEqual([{ id: 1, name: 'Workout 1' }, { id: 2, name: 'Workout 2' }]);
    expect(fetchWorkouts).toHaveBeenCalledTimes(1);
  });

  it('should create a workout', async () => {
    // Set up a mock response for createWorkout
    createWorkout.mockResolvedValue({ id: 3, name: 'Workout 3' });

    const newWorkout = await createWorkout({ name: 'Workout 3' });

    expect(newWorkout).toEqual({ id: 3, name: 'Workout 3' });
    expect(createWorkout).toHaveBeenCalledWith({ name: 'Workout 3' });
  });

  it('should update a workout', async () => {
    // Set up a mock response for updateWorkout
    updateWorkout.mockResolvedValue({ id: 1, name: 'Updated Workout' });

    const updatedWorkout = await updateWorkout(1, { name: 'Updated Workout' });

    expect(updatedWorkout).toEqual({ id: 1, name: 'Updated Workout' });
    expect(updateWorkout).toHaveBeenCalledWith(1, { name: 'Updated Workout' });
  });

  it('should delete a workout', async () => {
    // Set up a mock response for deleteWorkout
    deleteWorkout.mockResolvedValue({});

    await deleteWorkout(1);

    expect(deleteWorkout).toHaveBeenCalledWith(1);
  });
});
