import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container">
            <h1>Privacy Policy</h1>
            <p>Effective Date: January 19, 2025</p>
            <p>
                Welcome to <strong>IMAPS</strong>, your indoor mapping solution. Your privacy is
                important to us. This Privacy Policy explains how we collect, use, and
                protect your personal information.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
                We may collect the following types of information when you use our
                application:
            </p>
            <ul>
                <li>Location data for providing navigation and map services.</li>
                <li>
                    Device information, including operating system and browser type.
                </li>
                <li>
                    Usage data, such as search queries, clicks, and time spent on the app.
                </li>
                <li>Any feedback or messages you provide via the app.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
                The information we collect is used to:
            </p>
            <ul>
                <li>Provide accurate navigation and mapping services.</li>
                <li>Enhance the app's features and functionality.</li>
                <li>Analyze usage trends to improve performance.</li>
                <li>Respond to user queries and support requests.</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>
                We do not sell your personal information. However, we may share your
                data with:
            </p>
            <ul>
                <li>Third-party service providers who assist in app operations.</li>
                <li>
                    Legal authorities if required by law or to protect the app's security.
                </li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
                We implement industry-standard measures to protect your data. However,
                no system is completely secure, and we cannot guarantee absolute
                security.
            </p>

            <h2>5. Your Choices</h2>
            <p>
                You can control the information we collect by managing your device
                settings or opting out of certain features.
            </p>

            <h2>6. Changes to This Privacy Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. Changes will be
                posted on this page with an updated &#34;Effective Date.&#34;
            </p>

            <h2>7. Contact Us</h2>
            <p>
                If you have any questions or concerns about this Privacy Policy, please
                contact us at <a href="mailto:support@imaps.mk">support@imaps.mk</a>.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
