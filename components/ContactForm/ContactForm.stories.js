import ContactForm from './ContactForm.vue';

export default {
  title: 'Components/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Contact form component with validation, loading states, and form submission handling. This is an alternative contact form implementation that can be used independently.',
      },
    },
  },
};

export const Default = {
  args: {
    onSubmit: async (formData) => {
      console.log('Form submitted:', formData);
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default contact form appearance and functionality.',
      },
    },
  },
};

export const Mobile = {
  args: {
    onSubmit: async (formData) => {
      console.log('Mobile form submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 800));
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Contact form appearance on mobile devices.',
      },
    },
  },
};

// Form with validation examples
export const ValidationStates = {
  render: () => ({
    components: { ContactForm },
    setup() {
      const handleSubmit = async (formData) => {
        console.log('Validation form submitted:', formData);
        await new Promise(resolve => setTimeout(resolve, 1200));
      };
      return { handleSubmit };
    },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Default Form</h3>
          <ContactForm :onSubmit="handleSubmit" />
        </div>
        
        <div class="p-4 bg-amber-50 border border-amber-200 rounded">
          <h4 class="font-semibold text-amber-800 mb-2">Form Validation</h4>
          <ul class="text-sm text-amber-700 space-y-1">
            <li>• All fields are required except newsletter subscription</li>
            <li>• Email field validates for proper email format</li>
            <li>• Form shows loading state during submission</li>
            <li>• Success/error messages appear after submission</li>
          </ul>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Contact form showing validation requirements and behavior.',
      },
    },
  },
};

// Form styling variations
export const StyleVariations = {
  render: () => ({
    components: { ContactForm },
    setup() {
      const handleSubmit = async (formData) => {
        console.log('Style variation form submitted:', formData);
        await new Promise(resolve => setTimeout(resolve, 900));
      };
      return { handleSubmit };
    },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Default Styling</h3>
          <ContactForm :onSubmit="handleSubmit" />
        </div>
        
        <div class="p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
          <h3 class="text-lg font-semibold mb-4 text-white">On Brand Background</h3>
          <div class="bg-white rounded-lg p-6">
            <ContactForm :onSubmit="handleSubmit" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Contact form in different visual contexts and styling variations.',
      },
    },
  },
};

// Accessibility focused story
export const AccessibilityFeatures = {
  render: () => ({
    components: { ContactForm },
    setup() {
      const handleSubmit = async (formData) => {
        console.log('Accessibility form submitted:', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      };
      return { handleSubmit };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 class="font-semibold text-blue-800 mb-2">Accessibility Features</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• Proper label-input associations with 'for' attributes</li>
            <li>• Required fields marked with 'required' attribute</li>
            <li>• Form submission handled with prevent default</li>
            <li>• Loading and disabled states for better UX</li>
            <li>• Clear error and success messaging</li>
            <li>• Keyboard navigation support</li>
          </ul>
        </div>
        
        <ContactForm :onSubmit="handleSubmit" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Contact form highlighting accessibility features and best practices.',
      },
    },
  },
};

// Interactive demonstration
export const InteractiveDemo = {
  render: () => ({
    components: { ContactForm },
    setup() {
      const handleSubmit = async (formData) => {
        console.log('Interactive demo form submitted:', formData);
        // Longer delay to demonstrate loading state
        await new Promise(resolve => setTimeout(resolve, 2000));
      };
      return { handleSubmit };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded">
          <h4 class="font-semibold text-green-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-green-700 mb-2">
            Try interacting with the form below:
          </p>
          <ul class="text-sm text-green-700 space-y-1">
            <li>1. Fill out the form fields</li>
            <li>2. Submit the form to see the loading state</li>
            <li>3. Note: This is a demo, actual submission is simulated</li>
          </ul>
        </div>
        
        <ContactForm :onSubmit="handleSubmit" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of the contact form functionality.',
      },
    },
  },
};