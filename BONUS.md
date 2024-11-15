# Frontend Features

This document outlines the strengths and unique features of our frontend design, focused on enhancing user experience, efficiency, and security across various pages and functions.

1. **Pre-Validation for User Inputs**  
   - On the registration page, we validate the user’s email and name requirements before sending data to the backend. If the criteria aren’t met, an error popup guides the user, ensuring correct data entry.

2. **Seamless Navigation Between Login and Registration Pages**  
   - Users can transition directly between the login and registration pages without needing to return to the welcome page, improving user flow and reducing unnecessary clicks.

3. **Automatic Account Creation via Google Login**  
   - The login page supports Google Login, automatically creating an account for users without requiring separate registration. This seamless integration simplifies user onboarding.

4. **Captcha Security on Login Page**  
   - For enhanced security, we’ve added a CAPTCHA on the login page, requiring users to verify their identity as humans before logging in.

5. **Slidebar Navigation on Dashboard**  
   - A slidebar on the dashboard’s left side offers convenient navigation, allowing users to jump directly to different pages within the application.

6. **Direct Editing on Dashboard**  
   - Users can modify presentation names and distribution settings directly from the dashboard, simplifying and streamlining content management.

7. **Image Preview for New Slides**  
   - When creating a new slide, users can preview the thumbnail image upon upload, providing a visual confirmation of the image’s appearance.

8. **Night Mode on Dashboard**  
   - For easier nighttime use, the dashboard has a night mode option, creating a less intense and eye-friendly experience.

9. **Error Handling for Invalid Page Navigation**  
   - When users navigate to a non-existent presentation page, an error popup appears, automatically redirecting them back to the dashboard for a smooth recovery.

10. **User Feedback for Presentation Creation**  
   - After creating a new presentation, users receive a success or failure notification, ensuring they are aware of the outcome.

11. **Auto-Navigation to New Slides**  
   - Upon successfully creating a new presentation slide, the system automatically navigates users to the newly created slide, facilitating continuous workflow.

12. **Tooltips for Quick Feature Understanding**  
   - On the presentation page, tooltips provide explanations for each button, enabling users to quickly learn and use the available tools.

13. **Color Picker for Text Customization**  
   - We included a color card picker for text color selection, offering a straightforward and visually appealing way for users to customize their content.

14. **Slide List Navigation for Quick Page Access**  
   - On the presentation page, a slide list on the left allows users to quickly jump to any slide, enhancing navigation and reducing time spent on incremental page changes.

15. **Background Music on Presentation Page**  
    - Users have the option to add background music to their presentations, enhancing engagement and allowing for a more immersive experience.

16. **Comprehensive Deployment to Vercel with Adjusted Authentication Features**
    - We deployed both the frontend and backend of our web application to Vercel, even though backend deployment was not required. Additionally, we updated the Google Login and CAPTCHA settings to ensure full functionality after deployment, addressing potential issues that could arise from platform restrictions.

17. **Dynamic URL Updates for Slide Navigation**
    - When users add, delete, or switch between different slides on the presentation page, the URL dynamically updates to reflect the current slide. This ensures consistency between user actions and browser navigation, improving usability and enabling deep linking to specific slides.





