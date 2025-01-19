import React from "react";
import "./TermsOfService.css";

const TermsOfService = () => {
    return (
        <div className="terms-container">
            <h1>Terms of Service</h1>
            <p>Effective Date: January 19 2024</p>

            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using our indoor map application (“IMaps”), you agree to comply with and be bound by these Terms of Service (“Terms”). If you do not agree to these Terms, you may not use IMaps.
                </p>
            </section>

            <section>
                <h2>2. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting the updated Terms on our website. Your continued use of the IMaps constitutes acceptance of the revised Terms.
                </p>
            </section>

            <section>
                <h2>3. Use of IMaps</h2>
                <p>
                    You agree to use IMaps only for lawful purposes. You must not:
                </p>
                <ul>
                    <li>Engage in any activity that disrupts or interferes with IMaps.</li>
                    <li>Use IMaps for any fraudulent, unlawful, or harmful activity.</li>
                    <li>Attempt to gain unauthorized access to our servers or systems.</li>
                </ul>
            </section>

            <section>
                <h2>4. User Accounts</h2>
                <p>
                    To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
            </section>

            <section>
                <h2>5. Intellectual Property</h2>
                <p>
                    All content, designs, trademarks, and intellectual property associated with IMaps are the property of [Your Company Name] or its licensors. Unauthorized use of these materials is strictly prohibited.
                </p>
            </section>

            <section>
                <h2>6. Limitation of Liability</h2>
                <p>
                    To the maximum extent permitted by law, [Your Company Name] shall not be liable for any direct, indirect, incidental, or consequential damages arising out of your use of the IMaps.
                </p>
            </section>

            <section>
                <h2>7. Termination</h2>
                <p>
                    We reserve the right to terminate or suspend your access to IMaps at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the IMaps.
                </p>
            </section>

            <section>
                <h2>8. Governing Law</h2>
                <p>
                    These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts in [Your Location].
                </p>
            </section>

            <section>
                <h2>9. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at <a href="mailto:support@imaps.mk">support@imaps.mk</a>.
                </p>
            </section>
        </div>
    );
};

export default TermsOfService;
