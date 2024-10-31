import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SolidMarkdown } from 'solid-markdown';

function App() {
  const [courses, setCourses] = createSignal([]);
  const [lessons, setLessons] = createSignal([]);
  const [newCourse, setNewCourse] = createSignal({ title: '', description: '' });
  const [newLesson, setNewLesson] = createSignal({ title: '', content: '' });
  const [currentCourse, setCurrentCourse] = createSignal(null);
  const [currentLesson, setCurrentLesson] = createSignal(null);
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);

  const checkUserSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('dashboard');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('dashboard');
        fetchCourses();
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener?.data?.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getCourses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Error fetching courses:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const method = currentCourse() ? 'PUT' : 'POST';
      const response = await fetch('/api/saveCourse', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(
          currentCourse()
            ? { id: currentCourse().id, ...newCourse() }
            : newCourse()
        ),
      });
      if (response.ok) {
        await fetchCourses();
        setNewCourse({ title: '', description: '' });
        setCurrentCourse(null);
        setCurrentPage('dashboard');
      } else {
        console.error('Error saving course:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/saveCourse', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        await fetchCourses();
      } else {
        console.error('Error deleting course:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setLoading(false);
    }
  };

  const editCourse = (course) => {
    setNewCourse({ title: course.title, description: course.description });
    setCurrentCourse(course);
    setCurrentPage('editCourse');
  };

  const viewCourse = (course) => {
    setCurrentCourse(course);
    fetchLessons(course.id);
    setCurrentPage('viewCourse');
  };

  const fetchLessons = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getLessons?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      } else {
        console.error('Error fetching lessons:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const method = currentLesson() ? 'PUT' : 'POST';
      const response = await fetch('/api/saveLesson', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(
          currentLesson()
            ? { id: currentLesson().id, courseId: currentCourse().id, ...newLesson() }
            : { courseId: currentCourse().id, ...newLesson() }
        ),
      });
      if (response.ok) {
        await fetchLessons(currentCourse().id);
        setNewLesson({ title: '', content: '' });
        setCurrentLesson(null);
        setCurrentPage('viewCourse');
      } else {
        console.error('Error saving lesson:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/saveLesson', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        await fetchLessons(currentCourse().id);
      } else {
        console.error('Error deleting lesson:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const editLesson = (lesson) => {
    setNewLesson({ title: lesson.title, content: lesson.content });
    setCurrentLesson(lesson);
    setCurrentPage('editLesson');
  };

  const viewLesson = (lesson) => {
    setCurrentLesson(lesson);
    setCurrentPage('viewLesson');
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() !== 'login'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">
                Sign in with ZAPT
              </h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
                view="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
              Online Teaching Platform
            </h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <Show when={currentPage() === 'dashboard'}>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-purple-600">Available Courses</h2>
              <button
                class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  setNewCourse({ title: '', description: '' });
                  setCurrentCourse(null);
                  setCurrentPage('createCourse');
                }}
              >
                Create New Course
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <For each={courses()}>
                {(course) => (
                  <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <h2 class="text-2xl font-bold mb-2 text-purple-600">{course.title}</h2>
                    <p class="text-gray-700 mb-4">{course.description}</p>
                    <div class="flex space-x-2">
                      <button
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                        onClick={() => viewCourse(course)}
                      >
                        View
                      </button>
                      <Show when={course.userId === user().id}>
                        <button
                          class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                          onClick={() => editCourse(course)}
                        >
                          Edit
                        </button>
                        <button
                          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                          onClick={() => deleteCourse(course.id)}
                        >
                          Delete
                        </button>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show when={currentPage() === 'createCourse' || currentPage() === 'editCourse'}>
            <div class="max-w-xl mx-auto">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">
                {currentPage() === 'createCourse' ? 'Create New Course' : 'Edit Course'}
              </h2>
              <form onSubmit={saveCourse} class="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newCourse().title}
                  onInput={(e) => setNewCourse({ ...newCourse(), title: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newCourse().description}
                  onInput={(e) => setNewCourse({ ...newCourse(), description: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                ></textarea>
                <div class="flex space-x-4">
                  <button
                    type="submit"
                    class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                      loading() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading()}
                  >
                    {currentPage() === 'createCourse' ? 'Save Course' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={() => {
                      setNewCourse({ title: '', description: '' });
                      setCurrentCourse(null);
                      setCurrentPage('dashboard');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Show>

          <Show when={currentPage() === 'viewCourse'}>
            <div>
              <button
                class="mb-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  setCurrentCourse(null);
                  setCurrentPage('dashboard');
                }}
              >
                Back to Courses
              </button>
              <h2 class="text-3xl font-bold mb-2 text-purple-600">{currentCourse().title}</h2>
              <p class="text-gray-700 mb-4">{currentCourse().description}</p>
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold text-purple-600">Lessons</h3>
                <Show when={currentCourse().userId === user().id}>
                  <button
                    class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={() => {
                      setNewLesson({ title: '', content: '' });
                      setCurrentLesson(null);
                      setCurrentPage('createLesson');
                    }}
                  >
                    Add Lesson
                  </button>
                </Show>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <For each={lessons()}>
                  {(lesson) => (
                    <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                      <h3 class="text-xl font-bold mb-2 text-purple-600">{lesson.title}</h3>
                      <div class="flex space-x-2">
                        <button
                          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                          onClick={() => viewLesson(lesson)}
                        >
                          View
                        </button>
                        <Show when={currentCourse().userId === user().id}>
                          <button
                            class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                            onClick={() => editLesson(lesson)}
                          >
                            Edit
                          </button>
                          <button
                            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                            onClick={() => deleteLesson(lesson.id)}
                          >
                            Delete
                          </button>
                        </Show>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>

          <Show when={currentPage() === 'createLesson' || currentPage() === 'editLesson'}>
            <div class="max-w-xl mx-auto">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">
                {currentPage() === 'createLesson' ? 'Add New Lesson' : 'Edit Lesson'}
              </h2>
              <form onSubmit={saveLesson} class="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newLesson().title}
                  onInput={(e) => setNewLesson({ ...newLesson(), title: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
                <textarea
                  placeholder="Content (Markdown Supported)"
                  value={newLesson().content}
                  onInput={(e) => setNewLesson({ ...newLesson(), content: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border min-h-[200px]"
                  required
                ></textarea>
                <div class="flex space-x-4">
                  <button
                    type="submit"
                    class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                      loading() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading()}
                  >
                    {currentPage() === 'createLesson' ? 'Save Lesson' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={() => {
                      setNewLesson({ title: '', content: '' });
                      setCurrentLesson(null);
                      setCurrentPage('viewCourse');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Show>

          <Show when={currentPage() === 'viewLesson'}>
            <div class="max-w-xl mx-auto">
              <button
                class="mb-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  setCurrentLesson(null);
                  setCurrentPage('viewCourse');
                }}
              >
                Back to Lessons
              </button>
              <h2 class="text-3xl font-bold mb-2 text-purple-600">{currentLesson().title}</h2>
              <div class="bg-white p-4 rounded-lg shadow-md">
                <SolidMarkdown children={currentLesson().content} />
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;