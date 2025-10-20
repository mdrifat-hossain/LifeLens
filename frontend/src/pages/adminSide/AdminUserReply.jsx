import React from 'react'

function AdminUserReply() {
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
            class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary"
            href="#"
          >
            <span class="material-symbols-outlined">flag</span>
            <p class="text-sm font-medium leading-normal">Reports</p>
          </a>
          <a
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283039]"
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
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1
              class="text-gray-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]"
            >
              User Reports
            </h1>
            <div class="flex items-center gap-4">
              <div class="relative">
                <input
                  class="w-full max-w-xs pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-[#1c2127] border-gray-200 dark:border-[#3b4754] text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search reports..."
                  type="text"
                />
                <span
                  class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >search</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white dark:bg-[#1c2127] border-gray-200 dark:border-[#3b4754] text-gray-800 dark:text-white text-sm font-medium"
                >
                  <span class="material-symbols-outlined text-base"
                    >filter_list</span>
                  <span>Filter</span>
                </button>
                <button
                  class="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white dark:bg-[#1c2127] border-gray-200 dark:border-[#3b4754] text-gray-800 dark:text-white text-sm font-medium"
                >
                  <span class="material-symbols-outlined text-base">sort</span>
                  <span>Sort by</span>
                </button>
              </div>
            </div>
          </div>
          <div
            class="overflow-hidden rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]"
          >
            <table class="w-full text-left">
              <thead class="bg-gray-50 dark:bg-[#283039]">
                <tr>
                  <th
                    class="px-6 py-3 text-sm font-medium text-gray-600 dark:text-[#9dabb9] w-1/12"
                  >
                    <input
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="checkbox"
                    />
                  </th>
                  <th
                    class="px-6 py-3 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    User
                  </th>
                  <th
                    class="px-6 py-3 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Report
                  </th>
                  <th
                    class="px-6 py-3 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Category
                  </th>
                  <th
                    class="px-6 py-3 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Date
                  </th>
                  <th
                    class="px-6 py-3 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-[#3b4754]">
                <tr>
                  <td class="px-6 py-4">
                    <input
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                        style="
                          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXhuOJGG0DYiwNf9YlwjHa6Lxps5hvW6k3FFXZLc6NzTFRxBHHHdxhafdLaqUb2X6f2gQTC2O5V518AqdiSOjdBOALCyfhESrTCGoJ-wv8WMICCcJBTNho4NLdMHFLblj1oHPaVN-Yz0gDgogk4wmDmx0le3nMaT90OlNOhYB6RSn2C6U39ddFLaUiSuOsR3R4Ps7Xd6sv5tSIAgium0lRg_mASWiJ5LIymwOPZywi1k3vz9WCc65OZReVShPRrOQjP826NmdOo34');
                        "
                      ></div>
                      <div>
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          user_123
                        </p>
                        <p class="text-xs text-gray-500 dark:text-[#9dabb9]">
                          user123@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-600 dark:text-[#9dabb9] max-w-xs truncate"
                  >
                    I found a bug on the checkout page. The 'Apply Coupon'
                    button isn't working.
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-danger/20 text-danger"
                      >Bug Report</span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    2023-10-27
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-500"
                      >New</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <button class="text-primary hover:underline">Reply</button>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4">
                    <input
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                        style="
                          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXhuOJGG0DYiwNf9YlwjHa6Lxps5hvW6k3FFXZLc6NzTFRxBHHHdxhafdLaqUb2X6f2gQTC2O5V518AqdiSOjdBOALCyfhESrTCGoJ-wv8WMICCcJBTNho4NLdMHFLblj1oHPaVN-Yz0gDgogk4wmDmx0le3nMaT90OlNOhYB6RSn2C6U39ddFLaUiSuOsR3R4Ps7Xd6sv5tSIAgium0lRg_mASWiJ5LIymwOPZywi1k3vz9WCc65OZReVShPRrOQjP826NmdOo34');
                        "
                      ></div>
                      <div>
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          user_456
                        </p>
                        <p class="text-xs text-gray-500 dark:text-[#9dabb9]">
                          user456@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-600 dark:text-[#9dabb9] max-w-xs truncate"
                  >
                    Can you add a feature to export data to CSV? It would be
                    very helpful for my team.
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success"
                      >Feature Request</span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    2023-10-26
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-500"
                      >In Progress</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <button class="text-primary hover:underline">Reply</button>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4">
                    <input
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                        style="
                          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXhuOJGG0DYiwNf9YlwjHa6Lxps5hvW6k3FFXZLc6NzTFRxBHHHdxhafdLaqUb2X6f2gQTC2O5V518AqdiSOjdBOALCyfhESrTCGoJ-wv8WMICCcJBTNho4NLdMHFLblj1oHPaVN-Yz0gDgogk4wmDmx0le3nMaT90OlNOhYB6RSn2C6U39ddFLaUiSuOsR3R4Ps7Xd6sv5tSIAgium0lRg_mASWiJ5LIymwOPZywi1k3vz9WCc65OZReVShPRrOQjP826NmdOo34');
                        "
                      ></div>
                      <div>
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          user_789
                        </p>
                        <p class="text-xs text-gray-500 dark:text-[#9dabb9]">
                          user789@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-600 dark:text-[#9dabb9] max-w-xs truncate"
                  >
                    The UI on the settings page feels a bit cluttered. Maybe
                    simplify the layout?
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary"
                      >UI/UX Feedback</span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    2023-10-25
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-500"
                      >Resolved</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <button class="text-primary hover:underline">View</button>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4">
                    <input
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                        style="
                          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXhuOJGG0DYiwNf9YlwjHa6Lxps5hvW6k3FFXZLc6NzTFRxBHHHdxhafdLaqUb2X6f2gQTC2O5V518AqdiSOjdBOALCyfhESrTCGoJ-wv8WMICCcJBTNho4NLdMHFLblj1oHPaVN-Yz0gDgogk4wmDmx0le3nMaT90OlNOhYB6RSn2C6U39ddFLaUiSuOsR3R4Ps7Xd6sv5tSIAgium0lRg_mASWiJ5LIymwOPZywi1k3vz9WCc65OZReVShPRrOQjP826NmdOo34');
                        "
                      ></div>
                      <div>
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          user_101
                        </p>
                        <p class="text-xs text-gray-500 dark:text-[#9dabb9]">
                          user101@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-600 dark:text-[#9dabb9] max-w-xs truncate"
                  >
                    I'm having trouble logging in with my social media account.
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-danger/20 text-danger"
                      >Bug Report</span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    2023-10-24
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-500"
                      >New</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <button class="text-primary hover:underline">Reply</button>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4">
                    <input
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="checkbox"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                        style="
                          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXhuOJGG0DYiwNf9YlwjHa6Lxps5hvW6k3FFXZLc6NzTFRxBHHHdxhafdLaqUb2X6f2gQTC2O5V518AqdiSOjdBOALCyfhESrTCGoJ-wv8WMICCcJBTNho4NLdMHFLblj1oHPaVN-Yz0gDgogk4wmDmx0le3nMaT90OlNOhYB6RSn2C6U39ddFLaUiSuOsR3R4Ps7Xd6sv5tSIAgium0lRg_mASWiJ5LIymwOPZywi1k3vz9WCc65OZReVShPRrOQjP826NmdOo34');
                        "
                      ></div>
                      <div>
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          user_212
                        </p>
                        <p class="text-xs text-gray-500 dark:text-[#9dabb9]">
                          user212@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-600 dark:text-[#9dabb9] max-w-xs truncate"
                  >
                    The app crashes when I try to upload a file larger than 5MB.
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-danger/20 text-danger"
                      >Bug Report</span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    2023-10-23
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-500"
                      >Resolved</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <button class="text-primary hover:underline">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              class="flex justify-between items-center px-6 py-3 bg-gray-50 dark:bg-[#283039]"
            >
              <p class="text-sm text-gray-600 dark:text-[#9dabb9]">
                Showing 1 to 5 of 25 reports
              </p>
              <div class="flex items-center gap-2">
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  disabled=""
                >
                  Previous
                </button>
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminUserReply