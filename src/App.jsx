import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';

function App() {
  const [outlines, setOutlines] = createSignal([]);
  const [newOutline, setNewOutline] = createSignal({ title: '', description: '', content: '' });
  const [editingOutline, setEditingOutline] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('home');
  const [loading, setLoading] = createSignal(false);

  const fetchOutlines = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getOutlines');
      if (response.ok) {
        const data = await response.json();
        setOutlines(data);
      } else {
        console.error('Error fetching outlines:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching outlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOutline = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingOutline() ? 'PUT' : 'POST';
      const response = await fetch('/api/saveOutline', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingOutline() ? { id: editingOutline().id, ...newOutline() } : newOutline()),
      });
      if (response.ok) {
        await fetchOutlines();
        setNewOutline({ title: '', description: '', content: '' });
        setEditingOutline(null);
        setCurrentPage('home');
      } else {
        console.error('Error saving outline:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving outline:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOutline = async (id) => {
    setLoading(true);
    try {
      const response = await fetch('/api/saveOutline', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        await fetchOutlines();
      } else {
        console.error('Error deleting outline:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting outline:', error);
    } finally {
      setLoading(false);
    }
  };

  const editOutline = (outline) => {
    setNewOutline({ title: outline.title, description: outline.description, content: outline.content });
    setEditingOutline(outline);
    setCurrentPage('edit');
  };

  const viewOutline = (outline) => {
    setEditingOutline(outline);
    setCurrentPage('view');
  };

  onMount(fetchOutlines);

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600">Teaching Outlines</h1>
          <Show when={currentPage() === 'home'}>
            <button
              class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => {
                setNewOutline({ title: '', description: '', content: '' });
                setEditingOutline(null);
                setCurrentPage('create');
              }}
            >
              Create New Outline
            </button>
          </Show>
        </div>

        <Show when={currentPage() === 'home'}>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <For each={outlines()}>
              {(outline) => (
                <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  <h2 class="text-2xl font-bold mb-2 text-purple-600">{outline.title}</h2>
                  <p class="text-gray-700 mb-4">{outline.description}</p>
                  <div class="flex space-x-2">
                    <button
                      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                      onClick={() => viewOutline(outline)}
                    >
                      View
                    </button>
                    <button
                      class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                      onClick={() => editOutline(outline)}
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
                      onClick={() => deleteOutline(outline.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={currentPage() === 'create' || currentPage() === 'edit'}>
          <div class="max-w-xl mx-auto">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">
              {currentPage() === 'create' ? 'Create New Outline' : 'Edit Outline'}
            </h2>
            <form onSubmit={saveOutline} class="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newOutline().title}
                onInput={(e) => setNewOutline({ ...newOutline(), title: e.target.value })}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                required
              />
              <textarea
                placeholder="Description"
                value={newOutline().description}
                onInput={(e) => setNewOutline({ ...newOutline(), description: e.target.value })}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              ></textarea>
              <textarea
                placeholder="Content (Markdown Supported)"
                value={newOutline().content}
                onInput={(e) => setNewOutline({ ...newOutline(), content: e.target.value })}
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
                  {currentPage() === 'create' ? 'Save Outline' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setNewOutline({ title: '', description: '', content: '' });
                    setEditingOutline(null);
                    setCurrentPage('home');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Show>

        <Show when={currentPage() === 'view'}>
          <div class="max-w-xl mx-auto">
            <button
              class="mb-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => {
                setEditingOutline(null);
                setCurrentPage('home');
              }}
            >
              Back to Outlines
            </button>
            <h2 class="text-3xl font-bold mb-2 text-purple-600">{editingOutline().title}</h2>
            <p class="text-gray-700 mb-4">{editingOutline().description}</p>
            <div class="bg-white p-4 rounded-lg shadow-md">
              <SolidMarkdown children={editingOutline().content} />
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;