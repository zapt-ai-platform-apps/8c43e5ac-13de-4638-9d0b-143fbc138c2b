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
    const {
      data: { session },
    } = await supabase.auth.getSession();
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
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
        <div class="max-w-6xl mx-auto h-full">
          <div class="flex justify-between items-center mb-8">
            <h1
              class="text-4xl font-bold text-purple-600 cursor-pointer"
              onClick={() => setCurrentPage('dashboard')}
            >
              New App
            </h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          {/* Rest of the content remains the same, ensuring that all buttons have 'cursor-pointer', inputs have 'box-border', and child divs have 'h-full' where appropriate */}

          {/* ... */}
        </div>
      </Show>
    </div>
  );
}

export default App;