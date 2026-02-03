import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefereshTokens= async(userId)=>{
    try{
      const user= await User.findById(userId)
      const accessToken=user.generateAccessToken()
      const refereshToken=user.generateRefereshToken()
      user.refereshToken=refereshToken
      await user.save({validateBeforeSave:false})

      return {accessToken,refereshToken}
    }
    catch(error){
      throw new ApiError(500,"something went wrong while gernerting referesh and acess token")
    }
}

export const registerUser=asyncHandler(async(req,res)=>{
  const {username,email,password}=req.body
  if(!username || !email || !password ){
    throw new ApiError(400,"all fields are required")
  }

  const existingUser=await User.findOne({
    $or:[{email},{username}]
  });
  if(existingUser){
    throw new ApiError(400,"User already exists");
  }
  const user= await User.create({
    username:username.toLowerCase(),
    email,
    password
    
  });

  if(!user){
    throw new ApiError(400,"No user created");
  }

  const createdUser= await User.findById(user._id).select("-password -refereshToken");
  return res.status(200).json(new ApiResponse(200,createdUser,"User registered successfully"));
  


})



export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    throw new ApiError(400, "Email/Username and password required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refereshToken } =
    await generateAccessAndRefereshTokens(user._id);

  const loggedInUser = await User.findById(user._id)
    .select("-password -refereshToken");

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refereshToken, options)
    .json(
      new ApiResponse(200, { user: loggedInUser }, "Login successful")
    );
});


export const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $unset:{refereshToken:1}
  });
   const options = {
     httpOnly: true,
  secure: false, // MUST be false in localhost
  sameSite: "lax"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refereshToken", options)
    .json(new ApiResponse(200, {}, "Logged out"));
})

export const refereshAccessToken=asyncHandler(async(req,res)=>{
   const incomingRefereshToken=req.cookies.refereshToken || req.body.refereshToken
   if(!incomingRefereshToken){
    throw new ApiError(401,"unautorized request");
   }
  const decodedToken=jwt.verify(incomingRefereshToken,process.env.REFERESH_TOKEN_SECRET)
  const user=await User.findById(decodedToken?._id)
  if(!user){
     throw new ApiError(401, "Invalid refresh token");
  }
  if(incomingRefereshToken!==user?.refereshToken){
    throw new ApiError(401,"Referesh token i expired or used")
  }

   const options={
        httpOnly:true,
        secure:true

      }

      const{accessToken,refereshToken}=await generateAccessAndRefereshTokens(user._id)
      return res.status(200).cookie("accessToken",accessToken,options).cookie("refereshToken",refereshToken,options)
      .json( new ApiResponse(
        200,
        {accessToken,refereshToken}
      )

      )
 

})
export const getCurrentUser= asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"current user fetched sucessfully"))
  })
  