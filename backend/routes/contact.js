import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            company,
            service,
            budget,
            message,
        } = req.body;

        if (!name || !email || !service || !message) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing.",
            });
        }


        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });


        const mailOptions = {

            from: `"Nexus Techworks Website" <${process.env.EMAIL_USER}>`,

            to: "nexustechworks30@gmail.com",

            replyTo: email,

            subject: `New Nexus Techworks Enquiry - ${service}`,

            html: `
                <div
                    style="
                        font-family: Arial, sans-serif;
                        max-width: 650px;
                        margin: auto;
                        background: #ffffff;
                        border: 1px solid #eeeeee;
                    "
                >

                    <div
                        style="
                            background: #111111;
                            padding: 30px;
                            text-align: center;
                        "
                    >

                        <h1
                            style="
                                color: #ff1e1e;
                                margin: 0;
                            "
                        >
                            NEXUS TECHWORKS
                        </h1>

                        <p
                            style="
                                color: #ffffff;
                                margin-top: 8px;
                            "
                        >
                            New Website Enquiry
                        </p>

                    </div>


                    <div style="padding: 30px;">

                        <h2>New Client Enquiry</h2>


                        <p>
                            <strong>Name:</strong>
                            ${name}
                        </p>


                        <p>
                            <strong>Email:</strong>
                            ${email}
                        </p>


                        <p>
                            <strong>Phone:</strong>
                            ${phone || "Not provided"}
                        </p>


                        <p>
                            <strong>Company / Brand:</strong>
                            ${company || "Not provided"}
                        </p>


                        <p>
                            <strong>Service:</strong>
                            ${service}
                        </p>


                        <p>
                            <strong>Estimated Budget:</strong>
                            ${budget || "Not specified"}
                        </p>


                        <hr
                            style="
                                border: none;
                                border-top: 1px solid #eeeeee;
                                margin: 25px 0;
                            "
                        />


                        <h3>Project Details</h3>

                        <p
                            style="
                                line-height: 1.7;
                                white-space: pre-line;
                            "
                        >
                            ${message}
                        </p>


                        <hr
                            style="
                                border: none;
                                border-top: 1px solid #eeeeee;
                                margin: 25px 0;
                            "
                        />


                        <p
                            style="
                                color: #777777;
                                font-size: 13px;
                            "
                        >
                            This enquiry was submitted through
                            the Nexus Techworks website.
                        </p>

                    </div>

                </div>
            `,
        };


        await transporter.sendMail(mailOptions);


        return res.status(200).json({
            success: true,
            message: "Enquiry sent successfully.",
        });


    } catch (error) {

        console.error(
            "Contact email error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to send enquiry.",
        });
    }
});


export default router;