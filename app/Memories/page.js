"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Share2,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Plus,
  Camera,
  Video,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  Eye,
  CheckCircle

} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";


export default function MemoriesCommunityBlog() {
  const { token, isAuth } = useAuth();
  const [memories, setMemories] = useState([]);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    type: "photo",
    file: null,
    tags: "",
    isPublic: false,
    isLiked: false,
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [publicMemories, setPublicMemories] = useState([]);
  const [privateMemories, setPrivateMemories] = useState([]);


  useEffect(() => {
    document.title = "Memories, Community & Blogs | NeoNest";
    if (isAuth && token) {
    fetchMemories();
    }
  }, [isAuth, token]);

  const fetchMemories = async () => {
    try {
      const res = await axios.get(
        "/api/memories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'multipart/form-data'
          },
        }
      );
      console.log(res);

      setPublicMemories(res.data.publicMemories || []);
      setPrivateMemories(res.data.privateMemories || []);
    } catch (err) {
      console.error("Failed to fetch memories:", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileToUpload(selectedFile);
      setPreviewFile(URL.createObjectURL(selectedFile));
      if (editingMemory) {
        setEditingMemory((prev) => ({ ...prev, file: URL.createObjectURL(selectedFile) }));
      } else {
        setNewMemory((prev) => ({ ...prev, file: URL.createObjectURL(selectedFile) }));
      }
    } else {
      setFileToUpload(null);
      setPreviewFile(null);
      if (editingMemory) {
        setEditingMemory((prev) => ({ ...prev, file: null }));
      } else {
        setNewMemory((prev) => ({ ...prev, file: null }));
      }
    }
  };

  const handleAddUpdateMemory = async () => {
    setIsLoading(true);
    const data = new FormData();
    data.append("title", editingMemory ? editingMemory.title : newMemory.title);
    data.append("description", editingMemory ? editingMemory.description : newMemory.description);
    data.append("type", editingMemory ? editingMemory.type : newMemory.type);
    data.append("isPublic", editingMemory ? editingMemory.isPublic : newMemory.isPublic);
    data.append("tags", editingMemory ? (Array.isArray(editingMemory.tags) ? editingMemory.tags.join(",") : editingMemory.tags) : newMemory.tags);
    if (fileToUpload) {
      data.append("file", fileToUpload);
    }

    try {
      if (editingMemory) {
        await axios.put(
          `/api/memories/${editingMemory._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("/api/memories", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchMemories();
      resetForm();
    } catch (err) {
      console.error("Operation failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMemory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMemories();
      setSelectedMemory(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleLike = async (id) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/memories/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchMemories();
    } catch (err) {
      console.error("Like toggle failed", err);
    }
  };

  const resetForm = () => {
    setIsAddingMemory(false);
    setEditingMemory(null);
    setNewMemory({
      title: "",
      description: "",
      type: "photo",
      file: null,
      tags: "",
      isPublic: false,
      isLiked: false,
    });
    setFileToUpload(null);
    setPreviewFile(null);
  };

  // Show login prompt if user is not authenticated
  if (!isAuth) {
    return <LoginPrompt sectionName="memories and community" />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
          Memories, Community & Blogs
        </h1>
        <p className="text-xl text-gray-600 mt-3 max-w-2xl mx-auto">
          Share your precious stories, save your personal memories, and connect with a supportive community.
        </p>
        <Button
          onClick={() => {
            setIsAddingMemory(true);
            setEditingMemory(null);
          }}
          className="mt-6 px-8 py-3 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Memory
        </Button>
      </div>

      {/* Add/Edit Memory Form */}
      {(isAddingMemory || editingMemory) && (
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 p-6 shadow-xl rounded-xl">
          <CardHeader className="mb-6 p-0 flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-pink-700">
              {editingMemory ? <Edit className="w-7 h-7" /> : <Camera className="w-7 h-7" />}
              {editingMemory ? "Edit Your Memory" : "Share a New Memory"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-700">Title</label>
                <Input
                  id="title"
                  placeholder="e.g., Baby's First Steps"
                  value={editingMemory?.title || newMemory.title}
                  onChange={(e) =>
                    editingMemory
                      ? setEditingMemory({ ...editingMemory, title: e.target.value })
                      : setNewMemory({ ...newMemory, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-400 focus:border-pink-400 transition-all"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-semibold mb-2 text-gray-700">Type</label>
                <select
                  id="type"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-400 focus:border-pink-400 transition-all appearance-none bg-white pr-8"
                  value={editingMemory?.type || newMemory.type}
                  onChange={(e) =>
                    editingMemory
                      ? setEditingMemory({ ...editingMemory, type: e.target.value })
                      : setNewMemory({ ...newMemory, type: e.target.value })
                  }
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
              <textarea
                id="description"
                className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-y focus:ring-pink-400 focus:border-pink-400 transition-all"
                placeholder="What's the story behind this precious moment?"
                value={editingMemory?.description || newMemory.description}
                onChange={(e) =>
                  editingMemory
                    ? setEditingMemory({ ...editingMemory, description: e.target.value })
                    : setNewMemory({ ...newMemory, description: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="file-upload" className="block text-sm font-semibold mb-2 text-gray-700">Upload Media</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Choose File
                </label>
                {(previewFile || editingMemory?.file) && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    File selected <CheckCircle className="w-4 h-4" />
                  </span>
                )}
              </div>
              {(previewFile || editingMemory?.file) && (
                <div className="mt-4 relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
                  {newMemory.type === "video" || editingMemory?.type === "video" ? (
                    <Video className="w-full h-full text-gray-400 flex items-center justify-center" />
                  ) : (
                    <Image
                      src={previewFile || editingMemory?.file || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-semibold mb-2 text-gray-700">Tags (comma separated)</label>
              <Input
                id="tags"
                placeholder="e.g., #firsts, #babylove, #funny"
                value={
                  editingMemory
                    ? Array.isArray(editingMemory.tags)
                      ? editingMemory.tags.join(", ")
                      : editingMemory.tags
                    : newMemory.tags
                }
                onChange={(e) => {
                  editingMemory
                    ? setEditingMemory({ ...editingMemory, tags: e.target.value })
                    : setNewMemory({ ...newMemory, tags: e.target.value });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-400 focus:border-pink-400 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="isPublic" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={editingMemory ? editingMemory.isPublic : newMemory.isPublic}
                  onChange={(e) =>
                    editingMemory
                      ? setEditingMemory({ ...editingMemory, isPublic: e.target.checked })
                      : setNewMemory({ ...newMemory, isPublic: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {editingMemory?.isPublic || newMemory.isPublic ? "Public (Share with community)" : "Private (Keep to myself)"}
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddUpdateMemory}
                disabled={isLoading || !(editingMemory?.title || newMemory.title) || !(editingMemory?.description || newMemory.description)}
                className="flex-1 px-6 py-3 text-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md transition-all duration-300"
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? (editingMemory ? "Updating..." : "Adding...") : (editingMemory ? "Update Memory" : "Add Memory")}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex-1 px-6 py-3 text-lg text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Public Memories Section (Community Blog) */}
      <hr className="border-t-2 border-gray-200 my-10" />
      <Card className="border-0 shadow-none bg-white p-6 rounded-xl">
        <CardHeader className="mb-6 p-0">
          <CardTitle className="flex items-center gap-3 text-3xl font-bold text-blue-700">
            <Share2 className="w-8 h-8" />
            Community Blog
          </CardTitle>
          <p className="text-gray-600 mt-2">Discover and connect with shared memories from our community.</p>
        </CardHeader>
        <CardContent className="p-0">
          {publicMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publicMemories.map((memory) => (
                <div
                  key={memory._id}
                  className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedMemory(memory)}
                >
                  {/* Media Preview */}
                  <div className="aspect-square bg-gray-100 relative">
                    {memory.file ? (
                      memory.type === "video" ? (
                        <video
                          src={memory.file}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={memory.file}
                          alt={memory.title || "Memory Image"}
                          fill
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Memory Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {memory.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-3">
                      {memory.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {Array.isArray(memory.tags) && memory.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-3 border-gray-100">
                      <span>
                        {(memory.createdAt).split('T')[0]}
                      </span>
                      <div className="flex items-center gap-4">
                        {/* Likes */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(memory._id);
                          }}
                          className={`flex items-center gap-1 transition-colors ${memory.likes?.includes(memory._id) ? "text-pink-600" : "hover:text-pink-600"
                            }`}
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={memory.likes?.includes(memory._id) ? "currentColor" : "none"}
                          />
                          {memory.likes?.length || 0}
                        </button>

                        {/* Comments */}
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {memory.comments?.length || 0}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditingMemory(memory); setIsAddingMemory(true); }} className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteMemory(memory._id); }} className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
              <Share2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No public memories yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share a memory with the community!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Private Memories Section */}
      <hr className="border-t-2 border-gray-200 my-10" />
      <Card className="border-0 shadow-none bg-white p-6 rounded-xl">
        <CardHeader className="mb-6 p-0">
          <CardTitle className="flex items-center gap-3 text-3xl font-bold text-purple-700">
            <Camera className="w-8 h-8" />
            Your Private Memory Vault
          </CardTitle>
          <p className="text-gray-600 mt-2">Your personal collection of cherished moments, kept just for you.</p>
        </CardHeader>
        <CardContent className="p-0">
          {privateMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {privateMemories.map((memory) => (
                <div
                  key={memory._id}
                  className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedMemory(memory)}
                >
                  {/* Media */}
                  <div className="aspect-square bg-gray-100 relative">
                    {memory.file ? (
                      memory.type === "video" ? (
                        <video
                          src={memory.file}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={memory.file}
                          alt={memory.title || "Private Memory"}
                          fill
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Textual content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1 text-gray-800 group-hover:text-purple-600 transition-colors">
                      {memory.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-3">
                      {memory.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {Array.isArray(memory.tags) &&
                        memory.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 border-purple-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-3 border-gray-100">
                      <span>{new Date(memory.createdAt).toLocaleDateString("en-GB")}</span>
                      <div className="flex items-center gap-4">
                        {/* Like */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(memory._id);
                          }}
                          className={`flex items-center gap-1 transition-colors ${memory.likes?.includes(memory?._id) ? "text-pink-600" : "hover:text-pink-600"
                            }`}
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={memory.likes?.includes(memory?._id) ? "currentColor" : "none"}
                          />
                          {memory.likes?.length || 0}
                        </button>

                        {/* Comments */}
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {memory.comments?.length || 0}
                        </div>
                      </div>
                    </div>

                    {/* Edit/Delete buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMemory(memory);
                          setIsAddingMemory(true);
                        }}
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMemory(memory._id);
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Your memory vault is empty</h3>
              <p className="text-gray-500 mb-6">Start capturing your personal precious moments.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Memory Detail Modal/Sidebar */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-auto">
          <Card className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </Button>
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedMemory.title}</h2>
              {selectedMemory.file && (
                <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden mb-6">
                  {selectedMemory.type === "video" ? (
                    <video src={selectedMemory.file} controls className="w-full h-full object-contain" />
                  ) : (
                    <Image
                      src={selectedMemory.file}
                      alt={selectedMemory.title}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              )}
              <p className="text-gray-700 text-lg mb-4">{selectedMemory.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(selectedMemory.tags) && selectedMemory.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-gray-100 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4 mt-4 border-gray-100">
                <span>Created on: {new Date(selectedMemory.date).toLocaleDateString('en-GB')}</span>
                <div className="flex items-center gap-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(selectedMemory.id);
                    }}
                    className={`flex items-center gap-1 text-base transition-colors ${selectedMemory.isLiked ? "text-pink-600" : "hover:text-pink-600"
                      }`}
                  >
                    <Heart className="w-5 h-5" fill={selectedMemory.isLiked ? "currentColor" : "none"} />
                    {selectedMemory.likes}
                  </button>
                  <div className="flex items-center gap-1 text-base">
                    <MessageCircle className="w-5 h-5" />
                    {selectedMemory.comments?.length || 0}
                  </div>
                </div>
              </div>
              {/* Add comments section here (might add in future*/}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}