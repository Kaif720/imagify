import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const BuyCredit = () => {

  const { user, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext);

  const navigate = useNavigate()

  const initPay = async (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits payment",
      description: 'Credits payment',
      order_id: order.id,
      receipt: order.receipt,


      handler: async (response) => {
    try {
        console.log("RAZORPAY RESPONSE:", response);

        const { data } = await axios.post(
            backendUrl + "/api/user/verify-razor",
            response,
            {
                headers: { token }
            }
        );

        console.log("VERIFY RESPONSE:", data);

        if (data.success) {
            console.log("PAYMENT VERIFIED");

            await loadCreditsData();

            console.log("CREDITS UPDATED");

            toast.success("Credit added");

            navigate('/');

        } else {
            toast.error(data.message);
        }

    } catch (error) {
        console.log("VERIFY ERROR:", error);
        console.log("SERVER RESPONSE:", error.response?.data);

        toast.error(
            error.response?.data?.message || error.message
        );
    }
}

      

    }
    const rzp = new window.Razorpay(options)
    rzp.open()


  }

  const paymentRazorPay = async (planId) => {
    try {
      console.log("PAYMENT FUNCTION CALLED");
      console.log("PLAN ID:", planId);
      console.log("USER:", user);
      console.log("TOKEN:", token);
      console.log("BACKEND URL:", backendUrl);

      if (!user) {
        console.log("USER NOT FOUND");
        setShowLogin(true);
        return;
      }

      const { data } = await axios.post(
        backendUrl + '/api/user/pay-razor',
        {
          userId: user._id,
          planId: planId
        },
        {
          headers: { token }
        }
      )

      console.log(user._id);

      console.log("PAYMENT RESPONSE:", data);

      if (data.success) {
        console.log("ORDER:", data.order);
        initPay(data.order);
      }

    } catch (error) {
      console.log("PAYMENT ERROR:", error);
      console.log("SERVER ERROR:", error.response?.data);
    }
  };

  return (
    <div className='min-h-[80vh] text-center pt-14 mb-10' >
      <button className='border border-gray =-400 px-10 py-2 rounded-full mb-6'>Our plans</button>

      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left' >
        {plans.map((item, index) => (

          <div key={index}
            className='bg-white drop-shadow-sm border-0 rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'
          >
            <img width={40}
              src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold' >{item.id}</p>
            <p className='text-sm' >{item.desc}</p>
            <p className='mt-6' >
              <span className='text-3xl font-medium' >${item.price}</span> /

              {item.credits} credits </p>

            <button
              onClick={() => {
                console.log("BUTTON CLICKED");
                console.log("PLAN ID:", item.id);
                paymentRazorPay(item.id);
              }}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? 'Purchase' : 'Get started'}
            </button>


          </div>

        ))}
      </div>

    </div>
  )
}

export default BuyCredit