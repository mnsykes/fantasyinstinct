import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Form(props) {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();

    function onSubmit (data) {
        alert(`Submit ${data.email} and ${data.password}`);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email">
                    Email
                    <input type="email"
                           name="email"
                           autoComplete="none"
                           {...register("email", {
                               required: "Email is required"
                           })}/>
                </label>
                {errors.email && <p style={{color: "crimson"}}>{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="password">
                    Password
                    <input type="password"
                           name="password"
                           autoComplete="none"
                           {...register("password", {
                               required: "Password is required",
                               minLength: {
                                   value: 4,
                                   message: "Password must be at least 4 characters"
                               },
                               maxLength: {
                                   value: 12,
                                   message: "Password must be at least 8 characters"
                               }

                           })}/>
                </label>
                {errors.password && <p style={{color: "crimson"}}>{errors.password.message}</p>}
            </div>

            <button type="submit">Create Account</button>
        </form>
    )
}