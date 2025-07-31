// import User from "@/app/models/User.model";
// import connectDB from "@/lib/connectDB";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { authenticateToken } from "@/lib/auth";

// await connectDB();
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name, email, password } = body;

//     if (!name || !email || !password) {
//       return Response.json(
//         { error: "Please provide all details" },
//         { status: 422 }
//       );
//     }

//     if (!email.includes("@")) {
//       return Response.json(
//         { error: "Please enter valid email id" },
//         { status: 422 }
//       );
//     }

//     if (password.length < 6) {
//       return Response.json(
//         { error: "Password must be at least 8 characters" },
//         { status: 422 }
//       );
//     }

//     const userExists = await User.findOne({ email: email.toLowerCase() });
//     if (userExists) {
//       return Response.json(
//         { error: "Email already exists! Login instead" },
//         { status: 422 }
//       );
//     }

//     const hashPass = await bcryptjs.hash(password, 10);
//     const newUser = new User({
//       name,
//       email: email.toLowerCase(),
//       password: hashPass,
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       {
//         id: newUser._id,
//         email: newUser.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return Response.json(
//       {
//         success: "User registered Successfully!",
//         newUser,
//         token,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { noOfBabies, deliveryType } = body;
//     const BabyDet = JSON.parse(body.BabyDet);

//     if (!noOfBabies || !deliveryType) {
//       return Response.json(
//         { error: "Please provide all details" },
//         { status: 422 }
//       );
//     }
//     if(BabyDet.length != noOfBabies){
//         return Response.json(
//           { error: "Please provide all baby details" },
//           { status: 422 }
//         );
//     }
//     for (let i = 0; i < noOfBabies; i++) {
//       console.log(BabyDet[0])
//       if (
//         !BabyDet[i].babyName ||
//         !BabyDet[i].dateOfBirth ||
//         !BabyDet[i].time ||
//         !BabyDet[i].gender
//       ) {
//         return Response.json(
//           { error: "Please provide all baby details" },
//           { status: 422 }
//         );
//       }
//     }

//     const { user, error } = await authenticateToken(req);
//     if (error) {
//       return new Response(JSON.stringify({ error }), { status: 401 });
//     }

//     const userExists = await User.findOne({ email: user.email });
//     if (!userExists) {
//       return Response.json(
//         { error: "no such email exists! signup first" },
//         { status: 422 }
//       );
//     }
//     const updatedUser = await User.findByIdAndUpdate( user.id , {
//       noOfBabies,
//       deliveryType,
//       BabyDet
//     },
//     {
//       new: true,
//       runValidators: false, // Important!
//     });

//     console.log(updatedUser);

//     return Response.json(
//       {
//         success: "User updated Successfully!",
//         updatedUser: updatedUser.toObject(),
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }

import User from "@/app/models/User.model";
import connectDB from "@/lib/connectDB";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticateToken } from "@/lib/auth";

await connectDB();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: "Please provide all details" },
        { status: 422 }
      );
    }

    if (!email.includes("@")) {
      return Response.json(
        { error: "Please enter valid email id" },
        { status: 422 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 422 }
      );
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return Response.json(
        { error: "Email already exists! Login instead" },
        { status: 422 }
      );
    }

    const hashPass = await bcryptjs.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashPass,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json(
      {
        success: "User registered Successfully!",
        newUser,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Backend POST error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    // THIS IS THE CRITICAL FIX: BabyDet is already an array/object after req.json()
    const { noOfBabies, deliveryType, BabyDet } = body;

    // console.log("Received BabyDet on backend:", BabyDet); // Uncomment for debugging if needed

    if (!noOfBabies || !deliveryType) {
      return Response.json(
        { error: "Please provide all details" },
        { status: 422 }
      );
    }
    // Corrected condition: BabyDet.length should match noOfBabies
    if (BabyDet.length !== noOfBabies) {
        return Response.json(
            { error: "Please provide all baby details for the specified number of babies" }, // More specific error
            { status: 422 }
        );
    }
    for (let i = 0; i < noOfBabies; i++) {
      // console.log("Checking baby details for index:", i, BabyDet[i]); // Uncomment for debugging if needed
      if (
        !BabyDet[i].babyName ||
        !BabyDet[i].dateOfBirth ||
        !BabyDet[i].time ||
        !BabyDet[i].gender
      ) {
        return Response.json(
          { error: `Please provide all details for Baby ${i + 1}` }, // More specific error
          { status: 422 }
        );
      }
    }

    const { user, error } = await authenticateToken(req);
    if (error) {
      return new Response(JSON.stringify({ error }), { status: 401 });
    }

    const userExists = await User.findOne({ email: user.email });
    if (!userExists) {
      return Response.json(
        { error: "no such user exists! signup first" }, // Changed message for clarity
        { status: 422 }
      );
    }
    const updatedUser = await User.findByIdAndUpdate( user.id , {
      noOfBabies,
      deliveryType,
      BabyDet // No need to JSON.stringify here, it's already an array
    },
    {
      new: true,
      runValidators: false, // Important! Consider enabling this for stricter schema validation
    });

    console.log("Updated User in PUT:", updatedUser);

    return Response.json(
      {
        success: "User updated Successfully!",
        updatedUser: updatedUser.toObject(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Backend PUT error:", error); // Clarified log for PUT
    // Add more specific logging here if the above console.log("Received BabyDet...") doesn't pinpoint it
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

