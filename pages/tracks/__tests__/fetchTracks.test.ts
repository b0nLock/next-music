import configureMockStore from "redux-mock-store";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Импортируем функцию для тестирования
import { fetchTracks } from "@/store/actions-creators/track";
import { TrackActionTypes } from "@/types/track";

// Mock store БЕЗ middleware (будем вызывать функцию напрямую)
const mockStore = configureMockStore();

// Тестовые данные
const mockTracks = [
  {
    _id: "1",
    name: "Test Track 1",
    artist: "Test Artist 1",
    text: "Test lyrics 1",
    listens: 100,
    audio: "audio1.mp3",
    picture: "picture1.jpg",
    comments: [],
  },
];

describe("fetchTracks action creator", () => {
  let mock: MockAdapter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  beforeEach(() => {
    // Создаём mock для axios
    mock = new MockAdapter(axios);
    // Создаём store с пустым initial state
    store = mockStore({
      tracks: [],
      error: "",
    });
  });

  afterEach(() => {
    mock.reset();
  });

  test("should dispatch FETCH_TRACKS_SUCCESS on successful API call", async () => {
    // Mock успешного ответа
    mock.onGet("http://localhost:5000/tracks").reply(200, mockTracks);

    // Вызываем action creator и получаем функцию
    const action = fetchTracks();

    // Вызываем функцию с dispatch-ом из mock store
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (action as any)(store.dispatch);

    // Проверяем dispatched actions
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: TrackActionTypes.FETCH_TRACKS,
      payload: mockTracks,
    });
  });

  test("should dispatch FETCH_TRACKS_ERROR on API failure", async () => {
    // Mock ошибки
    mock.onGet("http://localhost:5000/tracks").reply(500);

    // Вызываем action creator
    const action = fetchTracks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (action as any)(store.dispatch);

    // Проверяем dispatched actions
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: TrackActionTypes.FETCH_TRACKS_ERROR,
      payload: "Ошибка при загрузке треков",
    });
  });

  test("should handle network error", async () => {
    // Mock сетевой ошибки
    mock.onGet("http://localhost:5000/tracks").networkError();

    // Вызываем action creator
    const action = fetchTracks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (action as any)(store.dispatch);

    // Проверяем что была диспатчена ошибка
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: TrackActionTypes.FETCH_TRACKS_ERROR,
      payload: "Ошибка при загрузке треков",
    });
  });
});
