import { 
  Text, 
  Column, 
  Container, 
  Heading, 
  Html, 
  Row, 
  Section, 
  Tailwind, 
  Head, 
  Preview, 
  Body, 
  Link, 
} from "@react-email/components"
// We don't need DTOs here, just the props
// as the subscriber will prepare this data.

type PasswordResetEmailProps = {
  first_name?: string;  // Optional: "Hi Stacy,"
  email: string;        // Used as a fallback
  reset_link: string;   // The full URL: http://.../reset-password?token=...
}

function PasswordResetEmailComponent({ 
  first_name, 
  email, 
  reset_link 
}: PasswordResetEmailProps) {

  // Use the first name if available, otherwise use the email
  const recipientName = first_name || email;

  return (
    <Tailwind>
      <Html className="font-sans bg-gray-100">
        <Head />
        <Preview>Reset your password for Nhim Wen Luxury Hair</Preview>
        <Body className="bg-white my-10 mx-auto w-full max-w-2xl">
          
          {/* Header - Same as your order email for brand consistency */}
          <Section className="bg-[#27272a] text-white px-6 py-4">
            {/* This is the Medusa logo SVG from your example. 
                You should replace this with your Nhim Wen Luxury Hair logo URL. */}
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2447 3.92183L12.1688 1.57686C10.8352 0.807712 9.20112 0.807712 7.86753 1.57686L3.77285 3.92183C2.45804 4.69098 1.63159 6.11673 1.63159 7.63627V12.345C1.63159 13.8833 2.45804 15.2903 3.77285 16.0594L7.84875 18.4231C9.18234 19.1923 10.8165 19.1923 12.15 18.4231L16.2259 16.0594C17.5595 15.2903 18.3672 13.8833 18.3672 12.345V7.63627C18.4048 6.11673 17.5783 4.69098 16.2447 3.92183ZM10.0088 14.1834C7.69849 14.1834 5.82019 12.3075 5.82019 10C5.82019 7.69255 7.69849 5.81657 10.0088 5.81657C12.3191 5.81657 14.2162 7.69255 14.2162 10C14.2162 12.3075 12.3379 14.1834 10.0088 14.1834Z" fill="currentColor"></path></svg>
          </Section>

          {/* Reset Message */}
          <Container className="p-6">
            <Heading className="text-2xl font-bold text-center text-gray-800">
              Reset Your Password
            </Heading>
            <Text className="text-left text-gray-600 mt-6">
              Hi {recipientName},
            </Text>
            <Text className="text-left text-gray-600 mt-4">
              We received a request to reset the password for your Nhim Wen Luxury Hair account.
              Click the button below to set a new password.
            </Text>
          </Container>
          
          {/* Call to Action Button */}
          <Section className="text-center my-4">
            <Link
              href={reset_link}
              // Using inline style for the background color for email client compatibility
              // This is the 'brand-brown' color from your site
              style={{ backgroundColor: '#A67B5B' }} 
              className="text-white font-semibold py-3 px-6 rounded-md"
            >
              Set New Password
            </Link>
          </Section>

          {/* Fallback Text */}
          <Container className="px-6">
            <Text className="text-left text-gray-600 mt-4">
              If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
            </Text>
            <Text className="text-left text-gray-500 text-sm mt-6">
              If the button above doesn't work, copy and paste this link into your browser:
            </Text>
            <Link href={reset_link} className="text-blue-600 underline text-sm break-all">
              {reset_link}
            </Link>
          </Container>

          {/* Footer */}
          <Section className="bg-gray-50 p-6 mt-10">
            <Text className="text-center text-gray-500 text-sm">
              If you have any questions, reply to this email or contact our support team at info@nhimwenluxuryhair.com.
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-4">
              © {new Date().getFullYear()} Nhim Wen Luxury Hair. All rights reserved.
            </Text>
          </Section>
        </Body>
      </Html>
    </Tailwind>
  )
}

// Final export that your subscriber will import and use
export const passwordResetEmail = (props: PasswordResetEmailProps) => (
  <PasswordResetEmailComponent {...props} />
)