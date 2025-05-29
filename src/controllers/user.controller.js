import asynchandler from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asynchandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;

    if (!fullname || !username || !email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, 'User already exists');
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar is required');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, 'Failed to upload avatar to Cloudinary');
    }

    const user = await User.create({
        fullname,
        username,
        email,
        password,
        avatar: avatar.url,
        coverimage: coverimage?.url || '',
    });

    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong');
    }
    console.log(createdUser);

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, 'User registered successfully')
        );
});

export { registerUser };
