"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import { User, LogOut, ArrowLeft, Edit, Mail, Users, X, FileDown, Pencil, Calendar, Scale, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/store/chatStore";
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, logout, token, updateUserData } = useAuth();
  const router = useRouter();

  // State for UI
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBabyModalOpen, setIsBabyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBaby, setSelectedBaby] = useState(null);

  // State for editable fields
  const [editableUser, setEditableUser] = useState({ name: '', email: '', noOfBabies: '', deliveryType: '' });
  const [editableBaby, setEditableBaby] = useState({ babyName: '', dateOfBirth: '', weight: '' });

  useEffect(() => {
    if (user) {
      setEditableUser({
        name: user.name || '',
        email: user.email || '',
        noOfBabies: user.noOfBabies || 0,
        deliveryType: user.deliveryType || '',
      });
    }
  }, [user]);

  const openUserModal = () => {
    setEditableUser({ 
      name: user?.name || '', 
      email: user?.email || '', 
      noOfBabies: user?.noOfBabies || '', 
      deliveryType: user?.deliveryType || '' 
    });
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => setIsUserModalOpen(false);

  const openBabyModal = (baby) => {
    // Find the original baby data from user.BabyDet to avoid using modified gender
    const originalBaby = user?.BabyDet?.find(b => b._id === baby._id) || baby;
    setSelectedBaby(originalBaby);
    setEditableBaby({ 
      babyName: originalBaby.babyName || '', 
      dateOfBirth: originalBaby.dateOfBirth ? new Date(originalBaby.dateOfBirth).toISOString().split('T')[0] : '', 
      weight: originalBaby.weight || originalBaby.Weight || '' 
    });
    setIsBabyModalOpen(true);
  };

  const closeBabyModal = () => {
    setSelectedBaby(null);
    setIsBabyModalOpen(false);
  };

  // Calculate age in months and days
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let months = today.getMonth() - birth.getMonth();
    let years = today.getFullYear() - birth.getFullYear();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalMonths = years * 12 + months;
    
    // Calculate days for more precise age
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, birth.getDate());
    const days = Math.floor((today - lastMonthDate) / (1000 * 60 * 60 * 24));
    
    if (totalMonths === 0) {
      return `${days} days`;
    } else if (totalMonths < 12) {
      return `${totalMonths} months, ${days} days`;
    } else {
      const displayYears = Math.floor(totalMonths / 12);
      const displayMonths = totalMonths % 12;
      return `${displayYears} year${displayYears > 1 ? 's' : ''}, ${displayMonths} months`;
    }
  };

  const handleLogout = () => {
    // Toast feedback for logout
    toast.info('Logging out...', { toastId: 'logout' });
    try {
      useChatStore.getState().clearChatHistory();
      logout();
      toast.dismiss('logout');
      toast.success('Logged out successfully!', {
        autoClose: 3000,
        position: 'top-right'
      });
    } catch (e) {
      toast.dismiss('logout');
      toast.error('Something went wrong while logging out.', {
        autoClose: 5000,
        position: 'top-right'
      });
    } finally {
      router.push("/");
    }
  };

  const handleDownloadPDF = async () => {
    if (!token) {
      toast.error('Please log in to export your data (PDF).', {
        autoClose: 4000,
        position: 'top-right'
      });
      return;
    }

    try {
      setIsDownloading(true);
      toast.info('Generating report...', { toastId: 'pdf-export' });

      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user: displayUser, babies: displayBabies, email: displayUser?.email })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: 'Failed to generate PDF' }));
        throw new Error(payload.error || `Request failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = `neonest-comprehensive-report-${displayUser.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.dismiss('pdf-export');
      toast.success('PDF exported successfully!', {
        autoClose: 3000,
        position: 'top-right'
      });
    } catch (err) {
      console.error('PDF download error:', err);
      toast.dismiss('pdf-export');
      toast.error(err?.message || 'Failed to generate PDF. Please try again.', {
        autoClose: 5000,
        position: 'top-right'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Helper function to normalize gender values
  const normalizeGender = (gender) => {
    if (!gender) return 'other';
    const g = gender.toLowerCase();
    if (g === 'female' || g === 'girl' || g === 'f') return 'female';
    if (g === 'male' || g === 'boy' || g === 'm') return 'male';
    return 'other';
  };

  // Use only real user data from AuthContext
  const displayUser = user || { name: "", email: "" };
  const displayBabies = Array.isArray(user?.BabyDet)
    ? user.BabyDet.map(baby => ({
        ...baby,
        gender: normalizeGender(baby.gender),
        weight: baby.Weight || baby.weight // Handle both Weight and weight fields
      }))
    : [];

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
  };

  const handleBabyInputChange = (e) => {
    const { name, value } = e.target;
    setEditableBaby(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to validate required fields
  const validateRequiredFields = (data, requiredFields) => {
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  // Helper function to handle API response errors
  const handleApiError = (result, toastId) => {
    toast.dismiss(toastId);
    
    if (result.details && Array.isArray(result.details)) {
      toast.error(`Validation failed: ${result.details.join(', ')}`, {
        autoClose: 5000,
        position: 'top-right'
      });
    } else if (result.details) {
      toast.error(result.details, {
        autoClose: 5000,
        position: 'top-right'
      });
    } else {
      toast.error(result.error || 'Operation failed', {
        autoClose: 5000,
        position: 'top-right'
      });
    }
  };

  const handleUserSave = async () => {
    setIsSaving(true);
    try {
      // Prepare the data with proper validation
      const userData = {
        name: editableUser.name?.trim(),
        email: editableUser.email?.trim(),
        noOfBabies: editableUser.noOfBabies,
        deliveryType: editableUser.deliveryType?.trim()
      };


      // Validate required fields
      if (!validateRequiredFields(userData, ['name', 'email'])) {
        setIsSaving(false);
        return;
      }

      // Show loading toast
      toast.info('Updating profile...', { toastId: 'user-update' });

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          type: 'user', 
          data: userData 
        })
      });

      const result = await res.json();

      if (!res.ok) {
        handleApiError(result, 'user-update');
        return;
      }

      // Update user in AuthContext immediately
      updateUserData(result.user);

      // Success toast
      toast.success('Profile updated successfully!', {
        autoClose: 3000,
        position: 'top-right'
      });
      
      closeUserModal();
    } catch (error) {
      console.error('Failed to save user profile:', error);
      toast.dismiss('user-update');
      toast.error('Network error. Please check your connection and try again.', {
        autoClose: 5000,
        position: 'top-right'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBabySave = async () => {
    setIsSaving(true);
    try {
      // Prepare the data with proper validation
      const babyData = {
        id: selectedBaby._id,
        babyName: editableBaby.babyName?.trim(),
        dateOfBirth: editableBaby.dateOfBirth,
        weight: editableBaby.weight
      };


      // Validate required fields
      if (!validateRequiredFields(babyData, ['babyName'])) {
        setIsSaving(false);
        return;
      }

      if (!babyData.id) {
        toast.error('Baby ID is missing');
        setIsSaving(false);
        return;
      }

      // Show loading toast
      toast.info('Updating baby details...', { toastId: 'baby-update' });

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          type: 'baby', 
          data: babyData 
        })
      });

      const result = await res.json();

      if (!res.ok) {
        handleApiError(result, 'baby-update');
        return;
      }

      // Update user in AuthContext immediately
      updateUserData(result.user);

      // Success toast
      toast.success('Baby details updated successfully!', {
        autoClose: 3000,
        position: 'top-right'
      });
      
      closeBabyModal();
    } catch (error) {
      console.error('Failed to save baby profile:', error);
      toast.dismiss('baby-update');
      toast.error('Network error. Please check your connection and try again.', {
        autoClose: 5000,
        position: 'top-right'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Arrow */}
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-6 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* User Profile Card */}
        <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-subtle rounded-3xl overflow-hidden mb-10">
          <CardContent className="p-8 relative">
            <Button variant="ghost" size="icon" onClick={openUserModal} className="absolute top-4 right-4 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full">
              <Pencil className="h-5 w-5" />
            </Button>
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
              <div className="w-28 mt-5 sm:mt-0 h-28 bg-gradient-to-br from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-700 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg mb-6 md:mb-0 md:mr-8">
                <User className="h-14 w-14 text-white/90" />
              </div>
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
                <p className="text-md text-slate-500 dark:text-slate-400 mt-1">Parent Account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <InfoField label="Name" value={user?.name} icon={<User className="h-5 w-5 text-blue-400" />} />
              <InfoField label="Email" value={user?.email} icon={<Mail className="h-5 w-5 text-purple-400" />} />
              <InfoField label="Number of Babies" value={user?.noOfBabies} icon={<Users className="h-5 w-5 text-green-400" />} />
              <InfoField label="Delivery Type" value={user?.deliveryType} icon={<Stethoscope className="h-5 w-5 text-red-400" />} />
            </div>
          </CardContent>
        </Card>

        {/* Baby Information Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Baby Information</h3>
          <div className="space-y-6">
            {displayBabies.map((baby, index) => (
              <Card key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-subtle rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex mt-5 sm:mt-0 items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                        normalizeGender(baby.gender) === 'female' ? 'bg-pink-100 dark:bg-pink-500/20' : 'bg-blue-100 dark:bg-blue-500/20'
                      }`}>
                        <span className={`text-2xl font-bold ${normalizeGender(baby.gender) === 'female' ? 'text-pink-500 dark:text-pink-400' : 'text-blue-500 dark:text-blue-400'}`}>
                          {normalizeGender(baby.gender) === 'female' ? '♀' : '♂'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{baby.babyName}</h4>
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mt-2 ${
                          normalizeGender(baby.gender) === 'female' ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${normalizeGender(baby.gender) === 'female' ? 'bg-pink-500' : 'bg-blue-500'}`} />
                          {normalizeGender(baby.gender) === 'female' ? 'Girl' : 'Boy'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {calculateAge(baby.dateOfBirth)}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => openBabyModal(baby)} className="text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full">
                        <Pencil className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl">
                      <Calendar className="h-6 w-6 text-slate-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Born</p>
                        <p className="font-semibold text-md text-slate-700 dark:text-slate-200">{formatDate(baby.dateOfBirth)}</p>
                      </div>
                    </div>
                    {(baby.weight || baby.Weight) && (
                      <div className="flex items-center gap-4 p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl">
                        <Scale className="h-6 w-6 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Birth Weight</p>
                          <p className="font-semibold text-md text-slate-700 dark:text-slate-200">{baby.weight || baby.Weight}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Button onClick={handleDownloadPDF} disabled={isDownloading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300">
            <FileDown className="mr-2 h-4 w-4" />
            {isDownloading ? 'Generating PDF...' : 'Export PDF'}
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* User Edit Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Edit User Information</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your profile details.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeUserModal} className="-mt-2 -mr-2 rounded-full"><X className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</label>
                  <input type="text" name="name" value={editableUser.name} onChange={handleUserInputChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
                  <input type="email" name="email" value={editableUser.email} onChange={handleUserInputChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Number of Babies</label>
                  <input type="number" name="noOfBabies" value={editableUser.noOfBabies} onChange={handleUserInputChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Delivery Type</label>
                  <input type="text" name="deliveryType" value={editableUser.deliveryType} onChange={handleUserInputChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={closeUserModal} className="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</Button>
                <Button onClick={handleUserSave} disabled={isSaving} className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-700 text-white">{isSaving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Baby Edit Modal */}
      {isBabyModalOpen && selectedBaby && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Edit Baby Information</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update details for {selectedBaby?.babyName}.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeBabyModal} className="-mt-2 -mr-2 rounded-full"><X className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
                            <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Baby's Name</label>
                  <input type="text" name="babyName" value={editableBaby.babyName} onChange={handleBabyInputChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={editableBaby.dateOfBirth} onChange={handleBabyInputChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Birth Weight</label>
                  <input type="text" name="weight" value={editableBaby.weight} onChange={handleBabyInputChange} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={closeBabyModal} className="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</Button>
                <Button onClick={handleBabySave} disabled={isSaving} className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-700 text-white">{isSaving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const InfoField = ({ label, value, icon }) => (
  <div className="flex items-start p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
    <div className="mr-4 mt-1 flex-shrink-0">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-md font-semibold text-slate-800 dark:text-white truncate mt-1">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
