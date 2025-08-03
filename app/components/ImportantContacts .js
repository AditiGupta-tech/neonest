"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card" 
import Input from "./ui/Input"
import { Button } from "./ui/Button" 
import Badge from "./ui/Badge" 
import { Plus, Phone, Globe, Edit, Trash2, Save, XCircle } from "lucide-react" 

export default function ImportantContacts() {
  const [contacts, setContacts] = useState([])
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [newContact, setNewContact] = useState({
    name: "",
    type: "phone", 
    value: "",
    description: "",
    category: "", 
  })

  useEffect(() => {
    const savedContacts = localStorage.getItem("importantMedicalContacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("importantMedicalContacts", JSON.stringify(contacts))
  }, [contacts])

  const handleAddContact = () => {
    if (newContact.name && newContact.value) {
      setContacts([...contacts, { id: Date.now(), ...newContact }])
      setNewContact({ name: "", type: "phone", value: "", description: "", category: "" }) 
      setIsAddingContact(false)
    }
  }

  const handleUpdateContact = (id) => {
    if (editingContact.name && editingContact.value) {
      setContacts(
        contacts.map((contact) =>
          contact.id === id ? { ...contact, ...editingContact } : contact
        )
      )
      setEditingContact(null)
    }
  }

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  const handleCancelEditOrAdd = () => {
    setIsAddingContact(false)
    setEditingContact(null)
    setNewContact({ name: "", type: "phone", value: "", description: "", category: "" }) 
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between **mb-4**"> 
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Important Medical Contacts</h2>
          <p className="text-gray-600 text-sm">Store essential doctor numbers, hospital contacts, and useful medical links.</p> 
        </div>
        <Button
          onClick={() => setIsAddingContact(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Add/Edit Contact Form */}
      {(isAddingContact || editingContact) && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingContact ? (
                <Edit className="w-5 h-5 text-purple-600" />
              ) : (
                <Plus className="w-5 h-5 text-purple-600" />
              )}
              {editingContact ? "Edit Contact" : "Add New Contact"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Name</label>
              <Input
                placeholder="e.g., Dr. Smith"
                value={editingContact ? editingContact.name : newContact.name}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({ ...editingContact, name: e.target.value })
                    : setNewContact({ ...newContact, name: e.target.value })
                }
              />
            </div>
            {/* New Category Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Category (e.g., Pediatrician, Gynecologist)</label>
              <Input
                placeholder="e.g., Pediatrician"
                value={editingContact ? editingContact.category : newContact.category}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({ ...editingContact, category: e.target.value })
                    : setNewContact({ ...newContact, category: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingContact ? editingContact.type : newContact.type}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({ ...editingContact, type: e.target.value })
                    : setNewContact({ ...newContact, type: e.target.value })
                }
              >
                <option value="phone">Phone Number</option>
                <option value="website">Website Link</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {editingContact?.type === "website" || newContact.type === "website"
                  ? "Website URL"
                  : "Phone Number"}
              </label>
              <Input
                type={
                  editingContact?.type === "website" || newContact.type === "website"
                    ? "url"
                    : "tel"
                }
                placeholder={
                  editingContact?.type === "website" || newContact.type === "website"
                    ? "https://example.com"
                    : "+1234567890"
                }
                value={editingContact ? editingContact.value : newContact.value}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({ ...editingContact, value: e.target.value })
                    : setNewContact({ ...newContact, value: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md h-20"
                placeholder="Brief description or notes..."
                value={editingContact ? editingContact.description : newContact.description}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({ ...editingContact, description: e.target.value })
                    : setNewContact({ ...newContact, description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingContact ? () => handleUpdateContact(editingContact.id) : handleAddContact}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingContact ? "Update" : "Add"} Contact
              </Button>
              <Button variant="outline" onClick={handleCancelEditOrAdd}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts List */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-purple-600" />
            Your Important Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No important contacts added yet.</p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white mt-4"
                onClick={() => setIsAddingContact(true)}
              >
                Add Your First Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {contact.type === "phone" ? (
                      <Phone className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Globe className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {contact.name}
                        {contact.category && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-700">
                            {contact.category}
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {contact.type === "phone" ? (
                          <a href={`tel:${contact.value}`} className="text-blue-500 hover:underline">
                            {contact.value}
                          </a>
                        ) : (
                          <a
                            href={contact.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:underline"
                          >
                            {contact.value}
                          </a>
                        )}
                      </p>
                      {contact.description && (
                        <p className="text-sm text-gray-500 italic">"{contact.description}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingContact(contact)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}