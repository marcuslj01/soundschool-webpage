import React from "react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-white mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Terms of Service & Privacy Policy
        </h1>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to Soundschool (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;). These Terms of Service and Privacy Policy govern
              your use of our website and services at soundschoolmidis.com. By
              using our services, you agree to these terms and our data
              collection practices.
            </p>
          </section>
          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>

            <h3 className="text-xl font-medium mb-3">
              2.1 Personal Information
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>
                <strong>Account Information:</strong> Email address, display
                name, password (when using email registration)
              </li>
              <li>
                <strong>Profile Data:</strong> Name, email address, profile
                picture (when using Google Sign-In)
              </li>
              <li>
                <strong>Contact Information:</strong> Name, email address,
                message content (when using contact form)
              </li>
              <li>
                <strong>Payment Information:</strong> Customer name, email
                address, payment details (processed securely by Stripe)
              </li>
              <li>
                <strong>Order Information:</strong> Purchase history, order
                details, download links
              </li>
              <li>
                <strong>Preferences:</strong> Newsletter and marketing
                communication preferences
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Technical Data</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>
                <strong>Authentication Data:</strong> Login timestamps, session
                information
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, features used,
                interaction patterns
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating
                system, IP address
              </li>
              <li>
                <strong>Analytics Data:</strong> Website usage statistics (via
                Firebase Analytics)
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.3 Local Storage</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Shopping Cart:</strong> Cart items stored in browser
                localStorage
              </li>
              <li>
                <strong>Session Data:</strong> Redirect URLs and temporary
                session information
              </li>
              <li>
                <strong>Authentication State:</strong> Login persistence using
                Firebase Auth
              </li>
            </ul>
          </section>
          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Third-Party Services
            </h2>

            <h3 className="text-xl font-medium mb-3">
              3.1 Authentication Services
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>
                <strong>Firebase Authentication:</strong> Handles user
                registration, login, and session management
              </li>
              <li>
                <strong>Google Sign-In:</strong> Provides OAuth authentication
                via Google accounts
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">3.2 Payment Processing</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>
                <strong>Stripe:</strong> Processes all payments and stores
                payment information securely
              </li>
              <li>
                <strong>Payment Data:</strong> Credit card information is never
                stored on our servers
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">
              3.3 Security & Analytics
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Google reCAPTCHA:</strong> Protects against spam and
                abuse on contact forms
              </li>
              <li>
                <strong>Firebase Analytics:</strong> Provides website usage
                analytics and performance monitoring
              </li>
              <li>
                <strong>Resend:</strong> Handles email delivery for order
                confirmations, product downloads, and contact form submissions
              </li>
            </ul>
          </section>
          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. How We Use Your Data
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Provide and maintain our music production services</li>
              <li>Process payments and fulfill orders</li>
              <li>Send order confirmations and download links</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our services and user experience</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your data with:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Service Providers:</strong> Stripe (payments), Resend
                (emails), Firebase (authentication/analytics)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In case of merger,
                acquisition, or sale of assets
              </li>
            </ul>
          </section>
          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>All data is encrypted in transit using HTTPS</li>
              <li>Firebase provides enterprise-grade security for user data</li>
              <li>Payment information is processed securely by Stripe</li>
              <li>Regular security audits and updates</li>
              <li>
                Access to personal data is limited to authorized personnel
              </li>
            </ul>
          </section>
          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Your Rights (GDPR)
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Under GDPR, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Rectification:</strong> Correct inaccurate or incomplete
                data
              </li>
              <li>
                <strong>Erasure:</strong> Request deletion of your personal data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a structured
                format
              </li>
              <li>
                <strong>Restriction:</strong> Limit how we process your data
              </li>
              <li>
                <strong>Objection:</strong> Object to processing based on
                legitimate interests
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Withdraw consent for
                marketing communications
              </li>
            </ul>
            <p className="text-gray-300 mt-4">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:schoolsound18@gmail.com"
                className="text-indigo-400 hover:text-indigo-300"
              >
                schoolsound18@gmail.com
              </a>
            </p>
          </section>
          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Account Data:</strong> Retained until account deletion
                or 3 years of inactivity
              </li>
              <li>
                <strong>Order Data:</strong> Retained for 7 years for tax and
                accounting purposes
              </li>
              <li>
                <strong>Contact Form Data:</strong> Retained for 2 years for
                customer service
              </li>
              <li>
                <strong>Analytics Data:</strong> Retained for 26 months
                (Firebase Analytics)
              </li>
              <li>
                <strong>Local Storage:</strong> Cleared when browser data is
                cleared or manually removed
              </li>
            </ul>
          </section>
          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Cookies and Local Storage
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the following storage methods and tracking technologies:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Firebase Analytics Cookies:</strong> Website usage
                statistics and performance monitoring
              </li>
              <li>
                <strong>Google reCAPTCHA Cookies:</strong> Security verification
                for form protection
              </li>
              <li>
                <strong>Firebase Auth Cookies:</strong> Authentication tokens
                and session management
              </li>
              <li>
                <strong>LocalStorage:</strong> Shopping cart items and user
                preferences
              </li>
              <li>
                <strong>SessionStorage:</strong> Temporary redirect URLs and
                session data
              </li>
            </ul>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-4">
              <p className="text-gray-300 text-sm">
                <strong>Cookie Consent:</strong> By using our website, you
                consent to the use of these cookies and storage methods for the
                purposes described above.
              </p>
            </div>
          </section>
          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Your data may be transferred to and processed in countries outside
              the European Economic Area (EEA). We ensure appropriate safeguards
              are in place through:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>Adequacy decisions by the European Commission</li>
              <li>Standard contractual clauses</li>
              <li>Certification schemes</li>
            </ul>
          </section>
          {/* Children&apos;s Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. Children&apos;s Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If you are a parent or guardian and believe your child
              has provided us with personal information, please contact us
              immediately.
            </p>
          </section>
          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              12. Changes to This Policy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last Updated&quot; date. You are
              advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </section>
          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-gray-300">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:schoolsound18@gmail.com"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  schoolsound18@gmail.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://soundschoolmidis.com/contact"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  soundschoolmidis.com/contact
                </a>
              </p>
            </div>
          </section>
          {/* Refund Policy */}
          <section id="refund-policy" className="scroll-mt-64">
            <h2 className="text-2xl font-semibold mb-4">14. Refund Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Downloadable products are delivered immediately after payment. By
              completing the purchase, you consent to immediate delivery, and
              the right of withdrawal therefore lapses in accordance with the
              Right of Withdrawal Act §22 letter n.
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Important:</strong> Due to the immediate digital
                delivery of our products, refunds are not available once the
                download has been initiated.
              </p>
            </div>
          </section>
          {/* Compatibility */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              15. Software Compatibility
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Soundschool does not guarantee compatibility with all versions of
              music software. The user is responsible for testing the files in
              their own system.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                Test files in your specific software version before purchase
              </li>
              <li>Check system requirements and compatibility notes</li>
              <li>Contact support if you experience technical issues</li>
            </ul>
          </section>
          {/* Usage Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              16. Usage Rights and License
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              When you purchase a product from Soundschool, you receive a
              non-exclusive, non-transferable license to use the files in your
              own music productions, both commercial and non-commercial. You are
              not permitted to resell, redistribute, or give away the files as
              standalone products.
            </p>

            <h3 className="text-xl font-medium mb-3">16.1 What You Can Do</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Use files in your own music productions</li>
              <li>Create commercial and non-commercial works</li>
              <li>Modify and adapt the files for your projects</li>
              <li>Include in your own compositions and arrangements</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">
              16.2 What You Cannot Do
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Resell the original files as standalone products</li>
              <li>Redistribute files to others</li>
              <li>Give away files to third parties</li>
              <li>Claim ownership of the original files</li>
            </ul>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>License Violation:</strong> Violation of these usage
                terms may result in legal action and termination of your
                license.
              </p>
            </div>
          </section>
          {/* Legal Basis */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              17. Legal Basis for Processing (GDPR)
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Contract Performance:</strong> Processing orders and
                providing services
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Website analytics,
                security, fraud prevention
              </li>
              <li>
                <strong>Consent:</strong> Marketing communications, newsletter
                subscriptions
              </li>
              <li>
                <strong>Legal Obligations:</strong> Tax records, accounting
                requirements
              </li>
            </ul>
          </section>
          {/* Force Majeure */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">18. Force Majeure</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We are not responsible for failure to fulfill our obligations if
              this is due to circumstances beyond our reasonable control,
              including but not limited to technical failures, power outages,
              network problems, force majeure events, or actions by third
              parties.
            </p>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Examples:</strong> Server outages, internet disruptions,
                payment processor failures, or other events outside our control.
              </p>
            </div>
          </section>
          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              19. Limitation of Liability
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              To the extent permitted by applicable law, Soundschool shall not
              be held liable for indirect losses, consequential damages, or loss
              of data resulting from the use or inability to use our services.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>
                Our liability is limited to the amount paid for the specific
                product
              </li>
              <li>
                We are not liable for lost profits or business interruption
              </li>
              <li>Data loss or corruption is not our responsibility</li>
              <li>Technical issues beyond our control are excluded</li>
            </ul>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Important:</strong> This limitation does not affect your
                statutory rights under consumer protection laws.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">20. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              These terms are governed by and construed in accordance with the
              laws of Norway. Any disputes shall be subject to the exclusive
              jurisdiction of the courts of Norway.
            </p>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Jurisdiction:</strong> All legal matters will be
                resolved under Norwegian law and in Norwegian courts, regardless
                of where you are located.
              </p>
            </div>
          </section>

          {/* Customer Responsibility for Purchases */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              21. Customer Responsibility for Purchases
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We provide technical safeguards to prevent customers from
              purchasing products they already own. However, it is ultimately
              the customer&apos;s responsibility to verify their purchase before
              completing the order. Soundschool is not liable for accidental
              duplicate purchases or purchases of products already owned by the
              customer, even in cases where technical checks are bypassed or
              fail.
            </p>
          </section>

          {/* Technical Compatibility Responsibility */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              22. Technical Compatibility Responsibility
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              While we provide compatibility information, the customer is
              responsible for testing demo files (if available) or reading
              specifications before purchase. We recommend testing files in your
              specific software version to ensure compatibility.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Test demo files before purchasing full versions</li>
              <li>Check software version compatibility</li>
              <li>Verify system requirements</li>
              <li>Contact support for technical questions</li>
            </ul>
          </section>

          {/* Account Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              23. Account Security
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your
              login credentials and for all activities that occur under your
              account. Soundschool is not liable for any losses resulting from
              unauthorized use of your account.
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Security Tips:</strong> Use strong passwords, enable
                two-factor authentication if available, and never share your
                login credentials with others.
              </p>
            </div>
          </section>

          {/* Service Misuse */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">24. Service Misuse</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We reserve the right to suspend or terminate accounts that violate
              these terms, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Attempting to bypass payment systems</li>
              <li>Illegally sharing or redistributing files</li>
              <li>Engaging in fraud or deceptive practices</li>
              <li>Creating multiple accounts to circumvent restrictions</li>
              <li>Using automated systems to access our services</li>
            </ul>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Consequences:</strong> Violation may result in immediate
                account termination without refund and potential legal action.
              </p>
            </div>
          </section>

          {/* Delivery Timeline */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              25. Delivery Timeline
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Digital files are typically delivered immediately after payment
              confirmation. However, delivery may be delayed due to technical
              issues, payment processing delays, or system maintenance. We will
              notify you of any significant delays.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Most downloads are available within minutes of payment</li>
              <li>Check your email for download links</li>
              <li>Contact support if download links expire</li>
              <li>Technical issues may cause temporary delays</li>
            </ul>
          </section>

          {/* Currency and Taxes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              26. Currency and Taxes
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Prices are displayed in the selected currency, but your
              bank&apos;s exchange rate may differ from the displayed rate. You
              are responsible for any local taxes, VAT, or import duties that
              may apply to your purchase.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Prices shown are in the selected currency</li>
              <li>Bank exchange rates may vary</li>
              <li>Local taxes and VAT are your responsibility</li>
              <li>Import duties may apply in some countries</li>
            </ul>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Note:</strong> We cannot provide tax advice. Please
                consult with your local tax authority for specific requirements.
              </p>
            </div>
          </section>

          {/* Account Deletion */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              27. Account Deletion
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the right to delete your account at any time. To delete
              your account, go to your account settings and use the delete
              account function. Please note that account deletion is permanent
              and cannot be undone.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Account deletion is permanent and irreversible</li>
              <li>All your data will be permanently removed</li>
              <li>Download links will no longer be accessible</li>
              <li>Order history will be deleted</li>
            </ul>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Warning:</strong> Before deleting your account, please
                download any purchased files you want to keep, as they will no
                longer be accessible after account deletion.
              </p>
            </div>
          </section>

          {/* Third-Party Links Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              28. Third-Party Links Disclaimer
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our website may contain links to external websites, social media
              platforms (such as YouTube, Discord, or other services), or
              third-party content. We are not responsible for the content,
              privacy practices, or availability of these external sites.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>External links are provided for convenience only</li>
              <li>We do not endorse or control third-party content</li>
              <li>External sites have their own privacy policies and terms</li>
              <li>Use external links at your own risk</li>
            </ul>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Note:</strong> When you click on external links, you
                leave our website and are subject to the terms and privacy
                policies of the external site.
              </p>
            </div>
          </section>

          {/* General Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              29. General Disclaimers
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our services are provided &quot;as is&quot; without any
              warranties. We do not guarantee that the service will always be
              available, error-free, or uninterrupted.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>We do not guarantee continuous service availability</li>
              <li>We are not responsible for errors in content or data</li>
              <li>Service is provided without warranties of any kind</li>
              <li>We do not guarantee compatibility with all systems</li>
            </ul>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Service Availability:</strong> While we strive for 99.9%
                uptime, technical issues may cause temporary service
                interruptions.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              30. Intellectual Property
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All content on this website, including but not limited to design,
              text, graphics, trademarks, logos, software, and downloadable
              products, is owned by Soundschool and is protected by copyright
              and other intellectual property laws.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Website design and layout are our exclusive property</li>
              <li>All text and graphics are copyrighted</li>
              <li>Trademarks and logos are our registered property</li>
              <li>Software and code are proprietary</li>
            </ul>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Copyright Notice:</strong> Unauthorized use of our
                intellectual property may result in legal action.
              </p>
            </div>
          </section>

          {/* No Waiver */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">31. No Waiver</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our failure to enforce any provision of these Terms of Service
              does not constitute a waiver of our right to enforce that
              provision or any other provision in the future.
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Enforcement Rights:</strong> Just because we don&apos;t
                immediately enforce a rule doesn&apos;t mean we give up the
                right to enforce it later.
              </p>
            </div>
          </section>

          {/* Severability and Entire Agreement */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              32. Severability and Entire Agreement
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If any provision of these Terms is found to be invalid or
              unenforceable under applicable law, such provision shall be
              removed without affecting the validity and enforceability of the
              remaining provisions. These Terms constitute the entire agreement
              between you and Soundschool regarding your use of our services and
              supersede any prior agreements or understandings.
            </p>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Legal Protection:</strong> This clause ensures that if
                one part of the agreement is invalid, the rest remains legally
                binding, and that this document constitutes the complete
                agreement between parties.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              33. Disclaimer of Warranties
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The services and products provided by Soundschool are offered
              &quot;as is&quot; and &quot;as available&quot; without any
              warranties of any kind, whether express or implied, including but
              not limited to warranties of merchantability, fitness for a
              particular purpose, and non-infringement. We do not guarantee that
              our services will be uninterrupted, error-free, secure, or meet
              your specific requirements.
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Important:</strong> You use our services at your own
                risk. We provide no guarantees about the quality, accuracy, or
                reliability of our products or services.
              </p>
            </div>
          </section>

          {/* DMCA and Copyright Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              34. DMCA and Copyright Policy
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We respect intellectual property rights and expect our users to do
              the same. If you believe that any content on our website infringes
              your copyright, please contact us with the following information:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>
                Description of the copyrighted work claimed to be infringed
              </li>
              <li>
                Description of where the material is located on our website
              </li>
              <li>Your contact information (name, address, phone, email)</li>
              <li>
                A statement of your good faith belief that use is not authorized
              </li>
              <li>
                A statement that the information is accurate and you are
                authorized to act
              </li>
            </ul>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong>Contact:</strong> Send copyright infringement notices to{" "}
                <a
                  href="mailto:schoolsound18@gmail.com"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  schoolsound18@gmail.com
                </a>{" "}
                with subject line &quot;Copyright Infringement Notice&quot;.
              </p>
            </div>
          </section>

          {/* Last Updated */}
          <section className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm">
              <strong>Last Updated:</strong>{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
