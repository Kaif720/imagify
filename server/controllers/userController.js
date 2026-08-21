import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import razorpay from 'razorpay'
import transactionModel from '../models/transcationModel.js';

const registerUser = async (req, res) => {


    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token, user: { name: user.name } })

    }
    catch (error) {


        console.log(error)
        res.json({ success: false, message: error.message })

    }

}


const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {

            return res.json({
                success: false,
                message: "User does not exist"
            })
        }


        const isMatched = await bcrypt.compare(password, user.password)

        if (isMatched) {

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    name: user.name
                }
            })
        }
        else {

            return res.json({ success: false, message: "Invalid credentials" })

        }

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })


    }

}


const userCredits = async (req, res) => {
    try {

        console.log("USER ID:", req.userId);

        const user = await userModel.findById(req.userId);

        console.log("FOUND USER:", user);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            credits: user.creditBalance,
            user: {
                _id: user._id,
                name: user.name
            }
        });

    } catch (error) {

        console.log("CREDITS ERROR:", error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const paymentRazorpay = async (req, res) => {

    try {

        const { userId, planId } = req.body

        if (!userId || !planId) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        let credits, plan, amount

        switch (planId) {

            case 'Basic':
                plan = "Basic"
                credits = 100
                amount = 10
                break

            case 'Advanced':
                plan = "Advanced"
                credits = 500
                amount = 50
                break

            case 'Business':
                plan = "Business"
                credits = 500
                amount = 250
                break

            default:
                return res.json({
                    success: false,
                    message: "Plan not found"
                })
        }

        const date = Date.now()

        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date
        }

        const newTransaction =
            await transactionModel.create(transactionData)

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id.toString()
        }

        razorpayInstance.orders.create(
            options,
            (error, order) => {

                if (error) {
                    console.log(error)

                    return res.json({
                        success: false,
                        message: error.message
                    })
                }

                return res.json({
                    success: true,
                    order
                })
            }
        )

    } catch (error) {

        console.log(error)

        return res.json({
            success: false,
            message: error.message
        })
    }
}

const verifyRazorpay = async (req, res) => {
    try {

        const { razorpay_order_id } = req.body;

        console.log("ORDER ID:", razorpay_order_id);

        const orderInfo = await razorpayInstance.orders.fetch(
            razorpay_order_id
        );

        console.log("ORDER STATUS:", orderInfo.status);

        if (orderInfo.status !== 'paid') {
            return res.json({
                success: false,
                message: "Payment failed"
            });
        }

        const transactionData = await transactionModel.findById(
            orderInfo.receipt
        );

        console.log("TRANSACTION:", transactionData);

        if (!transactionData) {
            return res.json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transactionData.payment) {
            return res.json({
                success: false,
                message: "Payment already processed"
            });
        }

        const userData = await userModel.findById(
            transactionData.userId
        );

        console.log("USER:", userData);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

         const creditBalance =
            userData.creditBalance + transactionData.credits;

        console.log("OLD CREDITS:", userData.creditBalance);
        console.log("ADDING CREDITS:", transactionData.credits);
        console.log("NEW CREDITS:", creditBalance);

        await userModel.findByIdAndUpdate(
            userData._id,
            {
                creditBalance
            }
        );

        await transactionModel.findByIdAndUpdate(
            transactionData._id,
            {
                payment: true
            }
        );

        return res.json({
            success: true,
            message: "Credits added"
        });

    } catch (error) {

        console.log("VERIFY ERROR:", error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay }