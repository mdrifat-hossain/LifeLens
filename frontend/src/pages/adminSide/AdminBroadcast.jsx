import React from 'react'

function AdminBroadcast() {
  return (
        <div class="flex h-full min-h-screen">
      <aside class="w-64 bg-[#1c2127] text-white flex flex-col p-4">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="Admin profile picture"
            style="
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSSmtTZiVVl-tiAoQK0pMhv_8c_Vri8ZNZF73i7R75GDq0Zr47QpfY0KQJI49zuO9SLINrx-6yHUCa36ML1mV3sq2N4CaG8Qes3ALVKoJ9BHJG5Ter9uMr-rOZqaw4yuDdFY1xyHPUNSbWO975rqD3VfT-dhMxLZa7xvFVG_qhcguLUkaUMEd3oVDxwMdKKIRjoxeHDlz8HemoeeMbqQfUlI5SIpC0PQdG4mAoLFfxjxfsj4ELsgq3RcFLq5C6t_4Ex0saaHeE3lY');
            "
          ></div>
          <div class="flex flex-col">
            <h1 class="text-white text-base font-medium leading-normal">
              Admin Panel
            </h1>
            <p class="text-[#9dabb9] text-sm font-normal leading-normal">
              System Administrator
            </p>
          </div>
        </div>
        <nav class="flex flex-col gap-2 flex-1">
          <a
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283039]"
            href="#"
          >
            <span class="material-symbols-outlined">dashboard</span>
            <p class="text-sm font-medium leading-normal">Dashboard</p>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283039]"
            href="#"
          >
            <span class="material-symbols-outlined">group</span>
            <p class="text-sm font-medium leading-normal">Users</p>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283039]"
            href="#"
          >
            <span class="material-symbols-outlined">flag</span>
            <p class="text-sm font-medium leading-normal">Reports</p>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary"
            href="#"
          >
            <span class="material-symbols-outlined">campaign</span>
            <p class="text-sm font-medium leading-normal">Broadcast</p>
          </a>
        </nav>
        <button
          class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-danger text-white text-sm font-bold leading-normal tracking-[0.015em] mt-8"
        >
          <span class="truncate">Logout</span>
        </button>
      </aside>
      <main class="flex-1 p-8">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col gap-8">
            <div>
              <p
                class="text-gray-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]"
              >
                Broadcast Message
              </p>
              <p class="text-gray-600 dark:text-[#9dabb9] mt-1">
                Compose and send a message to all users on the platform.
              </p>
            </div>
            <div
              class="flex flex-col gap-6 p-6 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]"
            >
              <div>
                <label
                  class="text-gray-800 dark:text-white text-sm font-medium"
                  for="message-subject"
                  >Subject</label>
                <input
                  class="w-full mt-2 p-3 rounded-md bg-gray-100 dark:bg-[#283039] text-gray-800 dark:text-white border border-gray-200 dark:border-[#3b4754] focus:ring-primary focus:border-primary"
                  id="message-subject"
                  placeholder="Enter message subject"
                  type="text"
                />
              </div>
              <div>
                <label
                  class="text-gray-800 dark:text-white text-sm font-medium"
                  for="message-body"
                  >Message</label>
                <div
                  class="mt-2 rounded-md border border-gray-200 dark:border-[#3b4754] bg-gray-100 dark:bg-[#283039]"
                >
                  <div
                    class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-[#3b4754]"
                  >
                    <button
                      class="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#3b4754]"
                    >
                      <span
                        class="material-symbols-outlined text-base text-gray-600 dark:text-gray-300"
                        >format_bold</span>
                    </button>
                    <button
                      class="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#3b4754]"
                    >
                      <span
                        class="material-symbols-outlined text-base text-gray-600 dark:text-gray-300"
                        >format_italic</span>
                    </button>
                    <button
                      class="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#3b4754]"
                    >
                      <span
                        class="material-symbols-outlined text-base text-gray-600 dark:text-gray-300"
                        >format_underlined</span>
                    </button>
                    <button
                      class="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#3b4754]"
                    >
                      <span
                        class="material-symbols-outlined text-base text-gray-600 dark:text-gray-300"
                        >format_list_bulleted</span>
                    </button>
                    <button
                      class="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#3b4754]"
                    >
                      <span
                        class="material-symbols-outlined text-base text-gray-600 dark:text-gray-300"
                        >format_list_numbered</span>
                    </button>
                    <button
                      class="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#3b4754]"
                    >
                      <span
                        class="material-symbols-outlined text-base text-gray-600 dark:text-gray-300"
                        >link</span>
                    </button>
                  </div>
                  <textarea
                    class="w-full p-3 bg-transparent text-gray-800 dark:text-white focus:outline-none"
                    id="message-body"
                    placeholder="Compose your message..."
                    rows="12"
                  ></textarea>
                </div>
              </div>
              <div class="flex justify-end gap-4">
                <button
                  class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#283039] text-gray-800 dark:text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span class="truncate">Save as Draft</span>
                </button>
                <button
                  class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span class="truncate">Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminBroadcast