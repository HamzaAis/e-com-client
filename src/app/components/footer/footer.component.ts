import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
      <!-- Call to Action Section -->
      <section
        class="bg-blue-500 text-white py-12 px-6 md:px-20 text-center flex flex-col items-center"
      >
        <h2 class="text-2xl font-bold mb-4">Join Our Newsletter</h2>
        <p class="text-lg mb-6">
          Get exclusive deals and updates straight to your inbox.
        </p>
        <form class="flex flex-col sm:flex-row items-center w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            class="px-4 py-2 rounded-md w-full sm:flex-1 mb-4 sm:mb-0 sm:mr-4 text-gray-700"
          />
          <button
            type="submit"
            class="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-gray-100"
          >
            Subscribe
          </button>
        </form>
      </section>
  `,
  styles: ``,
})
export class FooterComponent {}
