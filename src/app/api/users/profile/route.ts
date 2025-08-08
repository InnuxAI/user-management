import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, avatar, currentPassword, newPassword } = body

    // Connect to database
    await connectDB()

    // Find the current user by session user ID or email
    const user = await User.findOne({ 
      $or: [
        { _id: session.user.id },
        { email: session.user.email }
      ]
    })
    
    if (!user) {
      console.error("User not found with ID:", session.user.id, "or email:", session.user.email)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    console.log("Current user before update:", {
      id: user._id,
      name: user.name,
      email: user.email
    })

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change password" },
          { status: 400 }
        )
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long" },
          { status: 400 }
        )
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)
      user.password = hashedNewPassword
    }

    // Update name if provided
    if (name !== undefined) {
      user.name = name.trim() || null
      console.log("Updating name to:", user.name)
    }

    // Update avatar if provided
    if (avatar !== undefined) {
      user.avatar = avatar.trim() || null
      console.log("Updating avatar to:", user.avatar)
    }
    
    // Update email if provided and different
    if (email !== undefined && email !== user.email) {
      // Check if new email already exists
      const existingUser = await User.findOne({ 
        email: email, 
        _id: { $ne: user._id } 
      })
      if (existingUser) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 400 }
        )
      }
      user.email = email
      console.log("Updating email to:", user.email)
    }

    // Save updated user
    await user.save()

    console.log("User after update:", {
      id: user._id,
      name: user.name,
      email: user.email
    })

    // Return updated user data (excluding password)
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    })

  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
