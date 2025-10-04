import { NextResponse } from 'next/server';
import dbConnect from "@app/lib/db";
import User from "@models/User.model.js";
import { authenticateToken } from "@lib/auth";

// Validation schemas
const validateUserData = (data) => {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (data.noOfBabies !== undefined && (typeof data.noOfBabies !== 'number' || data.noOfBabies < 0)) {
    errors.push('Number of babies must be a non-negative number');
  }
  
  if (data.deliveryType && typeof data.deliveryType !== 'string') {
    errors.push('Delivery type must be a string');
  }
  
  return errors;
};

const validateBabyData = (data) => {
  const errors = [];
  
  console.log('Validating baby data:', data);
  
  if (!data.id || typeof data.id !== 'string') {
    errors.push('Baby ID is required');
  }
  
  if (!data.babyName || typeof data.babyName !== 'string' || data.babyName.trim().length === 0) {
    errors.push('Baby name is required and must be a non-empty string');
  }
  
  // More flexible date validation
  if (data.dateOfBirth) {
    const date = new Date(data.dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.push('Date of birth must be a valid date');
    } else {
      // Check if date is reasonable (not too far in the past or future)
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 10, 0, 1); // 10 years ago
      const maxDate = new Date(now.getFullYear() + 1, 11, 31); // 1 year in future
      
      if (date < minDate) {
        errors.push('Date of birth cannot be more than 10 years ago');
      } else if (date > maxDate) {
        errors.push('Date of birth cannot be more than 1 year in the future');
      }
    }
  }
  
  if (data.weight !== undefined && data.weight !== null && data.weight !== '') {
    const weight = parseFloat(data.weight);
    if (isNaN(weight) || weight < 0 || weight > 20) {
      errors.push('Weight must be a valid number between 0 and 20');
    }
  }
  
  console.log('Validation errors:', errors);
  return errors;
};

// Database connection wrapper with retry logic
const connectToDatabase = async () => {
  try {
    await dbConnect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
};

// Safe user update function
const updateUserProfile = async (userId, userData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: userData.name?.trim(),
        email: userData.email?.toLowerCase().trim(),
        noOfBabies: userData.noOfBabies,
        deliveryType: userData.deliveryType?.trim()
      },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('User not found in database');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Safe baby update function
const updateBabyProfile = async (userId, babyData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find baby using multiple methods for reliability
    let babyToUpdate = user.BabyDet.id(babyData.id);
    
    if (!babyToUpdate) {
      babyToUpdate = user.BabyDet.find(baby => baby._id.toString() === babyData.id);
    }
    
    if (!babyToUpdate) {
      const availableBabies = user.BabyDet.map(b => ({ id: b._id.toString(), name: b.babyName }));
      console.error('Baby not found. Available babies:', availableBabies);
      throw new Error(`Baby with ID ${babyData.id} not found`);
    }

    // Update baby fields safely
    babyToUpdate.babyName = babyData.babyName.trim();
    if (babyData.dateOfBirth) {
      babyToUpdate.dateOfBirth = new Date(babyData.dateOfBirth);
    }
    if (babyData.weight !== undefined) {
      babyToUpdate.Weight = String(babyData.weight);
    }

    // FIX: Correct invalid gender values before saving
    if (babyToUpdate.gender === 'Boy') {
      babyToUpdate.gender = 'male';
      console.warn(`Corrected invalid gender 'Boy' to 'male' for baby ID: ${babyData.id}`);
    } else if (babyToUpdate.gender === 'Girl') {
      babyToUpdate.gender = 'female';
      console.warn(`Corrected invalid gender 'Girl' to 'female' for baby ID: ${babyData.id}`);
    }

    // Also fix any other babies with invalid gender values
    user.BabyDet.forEach((baby, index) => {
      if (baby.gender === 'Boy') {
        baby.gender = 'male';
        console.warn(`Corrected invalid gender 'Boy' to 'male' for baby at index: ${index}`);
      } else if (baby.gender === 'Girl') {
        baby.gender = 'female';
        console.warn(`Corrected invalid gender 'Girl' to 'female' for baby at index: ${index}`);
      }
    });

    // Save with validation
    await user.save({ validateBeforeSave: true });

    // Return updated user
    const updatedUser = await User.findById(userId).select('-password');
    return updatedUser;
  } catch (error) {
    console.error('Error updating baby profile:', error);
    throw error;
  }
};

export async function POST(request) {
  let requestData = null;
  
  try {
    // Step 1: Parse request body safely
    try {
      requestData = await request.json();
      console.log('Received request data:', { type: requestData.type, hasData: !!requestData.data });
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError.message 
      }, { status: 400 });
    }

    // Step 2: Validate request structure
    if (!requestData || typeof requestData !== 'object') {
      return NextResponse.json({ 
        error: 'Request body must be a valid object' 
      }, { status: 400 });
    }

    const { type, data } = requestData;

    if (!type || typeof type !== 'string') {
      return NextResponse.json({ 
        error: 'Request type is required and must be a string' 
      }, { status: 400 });
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ 
        error: 'Request data is required and must be an object' 
      }, { status: 400 });
    }

    // Step 3: Connect to database
    await connectToDatabase();

    // Step 4: Authenticate user
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      console.error('Authentication failed:', authResult.error);
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: authResult.error 
      }, { status: 401 });
    }

    const tokenData = authResult.user;
    console.log('User authenticated:', tokenData.id);

    // Step 5: Handle different update types
    if (type === 'user') {
      // Validate user data
      const validationErrors = validateUserData(data);
      if (validationErrors.length > 0) {
        console.error('User data validation failed:', validationErrors);
        return NextResponse.json({ 
          error: 'Validation failed',
          details: validationErrors 
        }, { status: 400 });
      }

      // Update user profile
      const updatedUser = await updateUserProfile(tokenData.id, data);
      
      return NextResponse.json({ 
        message: 'User profile updated successfully', 
        user: updatedUser 
      }, { status: 200 });

    } else if (type === 'baby') {
      // Validate baby data
      const validationErrors = validateBabyData(data);
      if (validationErrors.length > 0) {
        console.error('Baby data validation failed:', validationErrors);
        return NextResponse.json({ 
          error: 'Validation failed',
          details: validationErrors 
        }, { status: 400 });
      }

      // Update baby profile
      const updatedUser = await updateBabyProfile(tokenData.id, data);
      
      return NextResponse.json({ 
        message: 'Baby profile updated successfully', 
        user: updatedUser 
      }, { status: 200 });

    } else {
      console.error('Invalid update type:', type);
      return NextResponse.json({ 
        error: 'Invalid update type. Must be "user" or "baby"' 
      }, { status: 400 });
    }

  } catch (error) {
    // Comprehensive error logging
    console.error('=== API ERROR DETAILS ===');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.error('Request data:', requestData);
    console.error('========================');

    // Return appropriate error response
    if (error.message.includes('Database connection failed')) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Unable to connect to the database. Please try again later.'
      }, { status: 503 });
    }

    if (error.message.includes('not found')) {
      return NextResponse.json({ 
        error: 'Resource not found',
        details: error.message 
      }, { status: 404 });
    }

    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Validation error',
        details: error.message 
      }, { status: 400 });
    }

    // Generic server error
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}
