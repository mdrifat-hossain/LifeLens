import React from 'react'

function AdminUserManagement() {
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
            class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary"
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
              Manage Users
            </h1>
            <div class="flex items-center gap-4">
              <div class="relative">
                <input
                  class="w-64 pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#1c2127] text-gray-800 dark:text-white border border-gray-200 dark:border-[#3b4754] focus:ring-primary focus:border-primary"
                  placeholder="Search users..."
                  type="text"
                />
                <span
                  class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >search</span>
              </div>
              <button
                class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <span class="material-symbols-outlined">add</span>
                <span>Add User</span>
              </button>
            </div>
          </div>
          <div
            class="overflow-hidden rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]"
          >
            <table class="w-full text-left">
              <thead class="bg-gray-50 dark:bg-[#283039]">
                <tr>
                  <th
                    class="px-6 py-4 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    User
                  </th>
                  <th
                    class="px-6 py-4 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-4 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-4 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Last Login
                  </th>
                  <th
                    class="px-6 py-4 text-sm font-medium text-gray-600 dark:text-[#9dabb9]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-[#3b4754]">
                <tr>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        alt="User avatar"
                        class="h-10 w-10 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9KOECtgkdKpIaElRut_N-TXpwTJXyLkyIkveMhuo8C82Do7vR3ajnvn8PXLK5bOpbU_8sgBdYDG1GCGYu0IgeVFN1DC8bBia3ZwYMmw72EQp0JbgTeTkq_gGapq86TQhqiu0CKrbyfj1eAoE9IedeE2-xRrdQbR3h2HdEyG6i-CdohkRT7HxK2sphzpuMw-hA4C6alFpyvDtpDg3sTjceEuHsmEzBZtb2b-RYZO06K_lI0GH99z_DVFa7fgCKFYtYHnftFu5i39U"
                      />
                      <div>
                        <p class="font-medium text-gray-800 dark:text-white">
                          John Doe
                        </p>
                        <p class="text-sm text-gray-500 dark:text-[#9dabb9]">
                          john.doe@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-800 dark:text-white">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary"
                      >Admin</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-success"></span>
                      Active
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    2 hours ago
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center gap-4">
                      <button class="text-primary hover:underline">Edit</button>
                      <button class="text-danger hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        alt="User avatar"
                        class="h-10 w-10 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9D8jgDDw8j4-8jKt9xfnZvGapcHxzy48aT1ZTHcCAwGtk_pgvicgMH9PluC8zn8dLJgOkcAgFMF3jkgWxIHMHDLU524tfcMAX_o587Jziainq132lwmrRFQmKDyqDthLjxcq3IsdPP-begUqQHs4w8WWf5uBcW9IXiqqHRBaUdLGNQMgtALGme3hUcnqRuBUWvzA0Hd8rhMn7597vjZ6ejFkABB4X8KIiuAKqz93v9rs_SKOGXewy_Exu3MYAoTVDk2zl-SCG4n4"
                      />
                      <div>
                        <p class="font-medium text-gray-800 dark:text-white">
                          Jane Smith
                        </p>
                        <p class="text-sm text-gray-500 dark:text-[#9dabb9]">
                          jane.smith@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-800 dark:text-white">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      >User</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-success"></span>
                      Active
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    1 day ago
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center gap-4">
                      <button class="text-primary hover:underline">Edit</button>
                      <button class="text-success hover:underline">
                        Make Admin
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        alt="User avatar"
                        class="h-10 w-10 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUhTVdEuRXCIsnWpqR_qB_AAxbpN_V95RcqdmNgxegMpnQHBC4BPpcQP2UB3hV1JfdXusgs-01d7qEN9BIiqrrVfusjHCcPA4NE93iGrKAY90VoD-iHNMYXZW28W8On7vTJt5kXAp98gdMDiETmu4Obsrxm3ZXxlzCkj1KOV0dcjWGeFFQZ62NAOwpB2SxsBU_lQvMLjxgrn1IV-6f64qU4LnbVrncuc_7a_4UNQCQP2Gw3z8J6Ya-ptT8QVCUSJDn95yRLDQ51b8"
                      />
                      <div>
                        <p class="font-medium text-gray-800 dark:text-white">
                          Sam Wilson
                        </p>
                        <p class="text-sm text-gray-500 dark:text-[#9dabb9]">
                          sam.wilson@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-800 dark:text-white">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      >User</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-danger/20 px-2 py-1 text-xs font-medium text-danger"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-danger"></span>
                      Inactive
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    3 weeks ago
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center gap-4">
                      <button class="text-primary hover:underline">Edit</button>
                      <button class="text-success hover:underline">
                        Make Admin
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        alt="User avatar"
                        class="h-10 w-10 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6PW6V8tuwQPQp2Wqq_NS1p7qEaIhSJkC-T7G8rc7aduMQu3fMZeuzeuwneoQDi0tg9t4eQOSOxiil8ZofE7kaTxouiSvVhKkXIhmzE87GojEuurmRMsVmSTkZvRfvXs9TVLjPvRimWlne9mR97wteRKgDrWDJ79pfIO76PGjPiKskKOBeko88znzeFSzWsEbMyA9kIgrdgUfPTJ-A2q9TnhA7R2aMo8EQxjxYBgbzQ-7_s3FZF-ZjF4EsCMhrzVmsONk90nAupa0"
                      />
                      <div>
                        <p class="font-medium text-gray-800 dark:text-white">
                          Emily Brown
                        </p>
                        <p class="text-sm text-gray-500 dark:text-[#9dabb9]">
                          emily.brown@example.com
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-800 dark:text-white">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      >User</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-success"></span>
                      Active
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-gray-500 dark:text-[#9dabb9]"
                  >
                    5 hours ago
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center gap-4">
                      <button class="text-primary hover:underline">Edit</button>
                      <button class="text-success hover:underline">
                        Make Admin
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              class="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-[#283039]"
            >
              <p class="text-sm text-gray-600 dark:text-[#9dabb9]">
                Showing 1 to 4 of 25 users
              </p>
              <div class="flex gap-2">
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md border border-primary bg-primary text-white"
                >
                  1
                </button>
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  2
                </button>
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  3
                </button>
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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

export default AdminUserManagement