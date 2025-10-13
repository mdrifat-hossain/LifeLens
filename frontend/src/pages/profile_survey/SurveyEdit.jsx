import React from 'react'

function SurveyEdit() {
  return (
        <div class="flex flex-col min-h-screen">
      <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-4xl mx-auto">
          <div class="mb-8">
            <h2
              class="text-3xl font-bold tracking-tight text-foreground-light dark:text-foreground-dark"
            >
              Profile Settings
            </h2>
            <p class="mt-2 text-text-light dark:text-text-dark">
              Manage your personal information and preferences.
            </p>
          </div>
          <div class="mb-8">
            <div class="mb-4">
              <h3
                class="text-2xl font-semibold tracking-tight text-foreground-light dark:text-foreground-dark"
              >
                Report
              </h3>
              <p class="mt-1 text-text-light dark:text-text-dark">
                View your generated nutrition and career reports, or send a
                report to the admin.
              </p>
            </div>
            <div
              class="bg-background-light dark:bg-background-dark border border-subtle-light dark:border-subtle-dark rounded-lg shadow-sm"
            >
              <input type="checkbox" id="toggle-report" class="peer hidden" />
              <label
                for="toggle-report"
                class="flex items-center justify-between p-4 cursor-pointer"
              >
                <h4
                  class="text-lg font-medium text-foreground-light dark:text-foreground-dark mb-2"
                >
                  Send Report to Admin
                </h4>
                <span
                  class="material-symbols-outlined transition-transform duration-300 peer-checked:rotate-180"
                >
                  expand_more
                </span>
              </label>
              <div
                class="max-h-0 overflow-hidden peer-checked:max-h-[800px] transition-all duration-500 ease-in-out p-0 peer-checked:p-4 border-t border-subtle-light dark:border-subtle-dark"
              >
                <p class="text-text-light dark:text-text-dark mb-4">
                  If you have any issues or questions, you can send a detailed
                  report to the admin team.
                </p>
                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                      for="report-message"
                      >Message</label>
                    <textarea
                      class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark placeholder-text-light dark:placeholder-text-dark"
                      id="report-message"
                      name="report-message"
                      placeholder="Describe the issue or your question in detail..."
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="flex justify-end">
                    <button
                      class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-background-dark shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      type="button"
                    >
                      Send Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-8">
            <div class="mb-4">
              <h3
                class="text-2xl font-semibold tracking-tight text-foreground-light dark:text-foreground-dark"
              >
                Edit Meal Survey
              </h3>
              <p class="mt-1 text-text-light dark:text-text-dark">
                Update your information to get more personalized meal plans and
                advice.
              </p>
            </div>
            <div
              class="bg-background-light dark:bg-background-dark border border-subtle-light dark:border-subtle-dark rounded-lg shadow-sm"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-8">
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="age"
                    >Age</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="age"
                    name="age"
                    type="number"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="gender"
                    >Gender</label>
                  <select
                    class="form-select mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="gender"
                    name="gender"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="height"
                    >Height (cm)</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="height"
                    name="height"
                    type="number"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="weight"
                    >Weight (kg)</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="weight"
                    name="weight"
                    type="number"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="dietary-pattern"
                    >Dietary Pattern</label>
                  <select
                    class="form-select mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="dietary-pattern"
                    name="dietary-pattern"
                  >
                    <option>Omnivore</option>
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>Pescatarian</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="food-allergies"
                    >Food Allergies (comma-separated)</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark placeholder-text-light dark:placeholder-text-dark"
                    id="food-allergies"
                    name="food-allergies"
                    placeholder="e.g. Peanuts, Shellfish, Gluten"
                    type="text"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="meals-per-day"
                    >Meals Per Day</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="meals-per-day"
                    name="meals-per-day"
                    type="number"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="snacks-per-day"
                    >Snacks Per Day</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="snacks-per-day"
                    name="snacks-per-day"
                    type="number"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="cuisines"
                    >Favorite Cuisines (comma-separated)</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark placeholder-text-light dark:placeholder-text-dark"
                    id="cuisines"
                    name="cuisines"
                    placeholder="e.g. Italian, Mexican, Japanese"
                    type="text"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="caffeine"
                    >Caffeine Consumption</label>
                  <select
                    class="form-select mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="caffeine"
                    name="caffeine"
                  >
                    <option>None</option>
                    <option>Low (1-2 cups/day)</option>
                    <option>Moderate (3-4 cups/day)</option>
                    <option>High (5+ cups/day)</option>
                  </select>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="activity-level"
                    >Activity Level</label>
                  <select
                    class="form-select mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="activity-level"
                    name="activity-level"
                  >
                    <option>Sedentary</option>
                    <option>Lightly Active</option>
                    <option>Moderately Active</option>
                    <option>Very Active</option>
                  </select>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="sleep-duration"
                    >Avg. Sleep (hours)</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="sleep-duration"
                    name="sleep-duration"
                    type="number"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="water-intake"
                    >Water Intake (liters)</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="water-intake"
                    name="water-intake"
                    type="number"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="meal-plan"
                    >Preferred Meal Plan</label>
                  <select
                    class="form-select mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="meal-plan"
                    name="meal-plan"
                  >
                    <option>Balanced</option>
                    <option>Low-Carb</option>
                    <option>High-Protein</option>
                    <option>Low-Fat</option>
                  </select>
                </div>
              </div>
              <div
                class="flex justify-end gap-4 p-4 bg-background-light dark:bg-background-dark border-t border-subtle-light dark:border-subtle-dark rounded-b-lg"
              >
                <button
                  class="px-4 py-2 text-sm font-semibold text-foreground-light dark:text-foreground-dark bg-subtle-light dark:bg-subtle-dark rounded-md shadow-sm hover:bg-subtle-light/80 dark:hover:bg-subtle-dark/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-background-dark shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          <div class="mb-12">
            <div class="mb-4">
              <h3
                class="text-2xl font-semibold tracking-tight text-foreground-light dark:text-foreground-dark"
              >
                Career Planning
              </h3>
              <p class="mt-1 text-text-light dark:text-text-dark">
                Tell us about your career aspirations.
              </p>
            </div>
            <div
              class="bg-background-light dark:bg-background-dark border border-subtle-light dark:border-subtle-dark rounded-lg shadow-sm"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-8">
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="current_user_location"
                    >Current Location</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="current_user_location"
                    name="current_user_location"
                    type="text"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="job_type"
                    >Job Type</label>
                  <select
                    class="form-select mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="job_type"
                    name="job_type"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="preferred_working_country"
                    >Preferred Working Country</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="preferred_working_country"
                    name="preferred_working_country"
                    type="text"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="preferred_industry"
                    >Preferred Industry</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="preferred_industry"
                    name="preferred_industry"
                    type="text"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="preferred_job_roles"
                    >Preferred Job Roles (comma-separated)</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark placeholder-text-light dark:placeholder-text-dark"
                    id="preferred_job_roles"
                    name="preferred_job_roles"
                    placeholder="e.g. Software Engineer, Product Manager"
                    type="text"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="career_goal"
                    >Career Goal</label>
                  <textarea
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="career_goal"
                    name="career_goal"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="preferred_career"
                    >Preferred Career</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="preferred_career"
                    name="preferred_career"
                    type="text"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="preferred_field_or_domain"
                    >Preferred Field or Domain</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="preferred_field_or_domain"
                    name="preferred_field_or_domain"
                    type="text"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="preferred_work_activity"
                    >Preferred Work Activity</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="preferred_work_activity"
                    name="preferred_work_activity"
                    type="text"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="industry_to_work_for"
                    >Industry to Work For</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="industry_to_work_for"
                    name="industry_to_work_for"
                    type="text"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    for="skill_to_develop"
                    >Skill to Develop</label>
                  <input
                    class="mt-1 block w-full rounded-md border-subtle-light dark:border-subtle-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark"
                    id="skill_to_develop"
                    name="skill_to_develop"
                    type="text"
                  />
                </div>
              </div>
              <div
                class="flex justify-end gap-4 p-4 bg-background-light dark:bg-background-dark border-t border-subtle-light dark:border-subtle-dark rounded-b-lg"
              >
                <button
                  class="px-4 py-2 text-sm font-semibold text-foreground-light dark:text-foreground-dark bg-subtle-light dark:bg-subtle-dark rounded-md shadow-sm hover:bg-subtle-light/80 dark:hover:bg-subtle-dark/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-background-dark shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SurveyEdit