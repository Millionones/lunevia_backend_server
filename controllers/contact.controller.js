import { asyncErrorHandler, Error, Response } from "express-error-catcher";

import model from "../model/index.js";
import { paginationParams, sendMail, unwantedFields } from "../helper/functions.js";

export const web = asyncErrorHandler(async (req) => {
    try {
        const { firstName, lastName, email, mobile, subject, comments } = req.body;

        if (isNull(firstName)) throw new Error("name is required", 412);

        if (isNull(email)) throw new Error("email is required", 412);

        if (isNull(mobile)) throw new Error("mobile is required", 412);

        await model
            .contact({
                firstName,
                lastName,
                email,
                mobile,
                subject,
                comments,
            })
            .save();

        await sendMail({
            from: "luneviaEnquiry@gmail.com",
            subject: `New Enquiry From ${firstName} ${lastName}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

                    <h2 style="color: #000;">
                        New Enquiry Received
                    </h2>

                    <p>
                        You have received a new enquiry through the website contact form.
                    </p>

                    <table 
                        cellpadding="10" 
                        cellspacing="0" 
                        border="1" 
                        style="border-collapse: collapse; width: 100%; max-width: 600px;"
                    >

                        <tr>
                            <td><strong>First Name</strong></td>
                            <td>${firstName}</td>
                        </tr>

                        <tr>
                            <td><strong>Last Name</strong></td>
                            <td>${lastName}</td>
                        </tr>

                        <tr>
                            <td><strong>Email Address</strong></td>
                            <td>${email}</td>
                        </tr>

                        <tr>
                            <td><strong>Mobile Number</strong></td>
                            <td>${mobile}</td>
                        </tr>

                        <tr>
                            <td><strong>Subject</strong></td>
                            <td>${subject}</td>
                        </tr>

                        <tr>
                            <td><strong>Comments / Questions</strong></td>
                            <td>${comments}</td>
                        </tr>

                    </table>

                    <br />

                    <p>
                        Please respond to this enquiry at the earliest convenience.
                    </p>

                    <p>
                        Regards,<br />
                        Website Enquiry System
                    </p>

                </div>
            `,
        })
        console.log('contact added')
        return new Response("Thank you for contacting us!", null, 200);
    } catch (error) {
        throw new Error(error.message);
    }
});

export const list = asyncErrorHandler(async (req) => {
    const query = { status: 0 };
    const { limit, skip } = paginationParams(req.query);

    const count = await model.contact.countDocuments(query);

    const data = await model.contact.find(query).skip(skip).limit(limit).select(unwantedFields()).sort({ _id: -1 });

    return new Response(null, { count, data }, 200);
});