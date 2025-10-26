"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Input from "./ui/Input";
import { Button } from "./ui/Button";
import Badge from "./ui/Badge";
import { Plus, Phone, Globe, Edit, Trash2, Save, XCircle } from "lucide-react";

export default function ImportantContacts() {
    const [contacts, setContacts] = useState([]);
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [newContact, setNewContact] = useState({
        name: "",
        type: "phone",
        value: "",
        description: "",
        category: "",
    });
    const [urlError, setUrlError] = useState("");
    const [urlTouched, setUrlTouched] = useState(false);

    // URL validation function
    const validateURL = (url) => {
        try {
            if (!url.trim()) {
                setUrlError("URL cannot be empty");
                return false;
            }
            if (!url.match(/^https?:\/\//)) {
                setUrlError("URL must start with http:// or https://");
                return false;
            }
            new URL(url);
            setUrlError("");
            return true;
        } catch (error) {
            setUrlError("Please enter a valid URL (e.g., https://example.com)");
            return false;
        }
    };

    // Phone validation function
    const validatePhone = (phone) => {
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phone.trim()) {
            setUrlError("Phone number cannot be empty");
            return false;
        }
        if (!phonePattern.test(phone.replace(/\s/g, ''))) {
            setUrlError("Please enter a valid phone number");
            return false;
        }
        setUrlError("");
        return true;
    };

    const handleValueChange = (e) => {
        const value = e.target.value;
        const type = editingContact ? editingContact.type : newContact.type;

        if (editingContact) {
            setEditingContact({...editingContact, value });
        } else {
            setNewContact({...newContact, value });
        }

        if (urlTouched || value.length > 0) {
            if (type === "website") {
                validateURL(value);
            } else {
                validatePhone(value);
            }
        }
    };

    useEffect(() => {
        const savedContacts = localStorage.getItem("importantMedicalContacts");
        if (savedContacts) {
            setContacts(JSON.parse(savedContacts));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("importantMedicalContacts", JSON.stringify(contacts));
    }, [contacts]);

    const handleAddContact = () => {
        const isValid = newContact.type === "website" ?
            validateURL(newContact.value) :
            validatePhone(newContact.value);

        if (!isValid) {
            setUrlTouched(true);
            return;
        }

        if (newContact.name && newContact.value && !urlError) {
            setContacts([...contacts, { id: Date.now(), ...newContact }]);
            setNewContact({ name: "", type: "phone", value: "", description: "", category: "" });
            setIsAddingContact(false);
            setUrlError("");
            setUrlTouched(false);
        }
    };

    const handleUpdateContact = (id) => {
        const isValid = editingContact.type === "website" ?
            validateURL(editingContact.value) :
            validatePhone(editingContact.value);

        if (!isValid) {
            setUrlTouched(true);
            return;
        }

        if (editingContact.name && editingContact.value && !urlError) {
            setContacts(contacts.map((contact) => (contact.id === id ? {...contact, ...editingContact } : contact)));
            setEditingContact(null);
            setUrlError("");
            setUrlTouched(false);
        }
    };

    const handleDeleteContact = (id) => {
        setContacts(contacts.filter((contact) => contact.id !== id));
    };

    const handleCancelEditOrAdd = () => {
        setIsAddingContact(false);
        setEditingContact(null);
        setNewContact({ name: "", type: "phone", value: "", description: "", category: "" });
        setUrlError("");
        setUrlTouched(false);
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        if (editingContact) {
            setEditingContact({...editingContact, type: newType, value: "" });
        } else {
            setNewContact({...newContact, type: newType, value: "" });
        }
        setUrlError("");
        setUrlTouched(false);
    };

    return ( <
        div className = "p-6 space-y-6 " >
        <
        div className = "flex flex-wrap items-center justify-between **mb-4**" >
        <
        div >
        <
        h2 className = "text-2xl font-bold text-gray-800 dark:text-gray-200" > Important Medical Contacts < /h2> <
        p className = "text-gray-600 dark:text-gray-300 text-sm" > Store essential doctor numbers, hospital contacts, and useful medical links. < /p> < /
        div > <
        Button onClick = {
            () => setIsAddingContact(true)
        }
        className = "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600" >
        <
        Plus className = "w-4 h-4 mr-2" / >
        Add Contact <
        /Button> < /
        div >

        { /* Add/Edit Contact Form */ } {
            (isAddingContact || editingContact) && ( <
                Card className = "bg-purple-50 dark:bg-gray-700 dark:text-gray-200 border-purple-200" >
                <
                CardHeader >
                <
                CardTitle className = "flex items-center gap-2" > { editingContact ? < Edit className = "w-5 h-5 text-purple-600" / > : < Plus className = "w-5 h-5 text-purple-600" / > } { editingContact ? "Edit Contact" : "Add New Contact" } <
                /CardTitle> < /
                CardHeader > <
                CardContent className = "space-y-4" >
                <
                div >
                <
                label className = "block text-sm font-medium mb-2" > Contact Name < /label> <
                Input placeholder = "e.g., Dr. Smith"
                className = "dark:bg-gray-600"
                value = { editingContact ? editingContact.name : newContact.name }
                onChange = {
                    (e) => (editingContact ? setEditingContact({...editingContact, name: e.target.value }) : setNewContact({...newContact, name: e.target.value }))
                }
                /> < /
                div > { /* New Category Input */ } <
                div >
                <
                label className = "block text-sm font-medium mb-2" > Category(e.g., Pediatrician, Gynecologist) < /label> <
                Input placeholder = "e.g., Pediatrician"
                className = "dark:bg-gray-600"
                value = { editingContact ? editingContact.category : newContact.category }
                onChange = {
                    (e) => (editingContact ? setEditingContact({...editingContact, category: e.target.value }) : setNewContact({...newContact, category: e.target.value }))
                }
                /> < /
                div > <
                div >
                <
                label className = "block text-sm font-medium mb-2" > Type < /label> <
                select className = "w-full p-2 border border-gray-300 dark:bg-gray-600 rounded-md"
                value = { editingContact ? editingContact.type : newContact.type }
                onChange = { handleTypeChange } >
                <
                option value = "phone" > Phone Number < /option> <
                option value = "website" > Website Link < /option> < /
                select > <
                /div> <
                div >
                <
                label className = "block text-sm font-medium mb-2" > { editingContact ? .type === "website" || newContact.type === "website" ? "Website URL" : "Phone Number" } < /label> <
                Input type = { editingContact ? .type === "website" || newContact.type === "website" ? "url" : "tel" }
                placeholder = { editingContact ? .type === "website" || newContact.type === "website" ? "https://example.com" : "+1234567890" }
                value = { editingContact ? editingContact.value : newContact.value }
                className = "dark:bg-gray-600"
                onChange = { handleValueChange }
                onBlur = {
                    () => {
                        setUrlTouched(true);
                        const currentValue = editingContact ? editingContact.value : newContact.value;
                        const currentType = editingContact ? editingContact.type : newContact.type;
                        if (currentType === "website") {
                            validateURL(currentValue);
                        } else {
                            validatePhone(currentValue);
                        }
                    }
                }
                /> {
                urlTouched && urlError && ( <
                    p className = "text-red-500 text-xs mt-1 flex items-center animate-shake" >
                    <
                    span className = "w-1 h-1 bg-red-500 rounded-full mr-2" > < /span> { urlError } < /
                    p >
                )
            } <
            /div> <
            div >
                <
                label className = "block text-sm font-medium mb-2" > Description(Optional) < /label> <
            textarea className = "w-full p-2 border border-gray-300 dark:bg-gray-600 rounded-md h-20"
            placeholder = "Brief description or notes..."
            value = { editingContact ? editingContact.description : newContact.description }
            onChange = {
                (e) => (editingContact ? setEditingContact({...editingContact, description: e.target.value }) : setNewContact({...newContact, description: e.target.value }))
            }
            /> < /
            div >

                <
                div className = "flex gap-2" >
                <
                Button onClick = { editingContact ? () => handleUpdateContact(editingContact.id) : handleAddContact }
            className = "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600" >
                <
                Save className = "w-4 h-4 mr-2" / > { editingContact ? "Update" : "Add" }
            Contact <
                /Button> <
            Button variant = "outline"
            onClick = { handleCancelEditOrAdd } >
                <
                XCircle className = "w-4 h-4 mr-2" / >
                Cancel <
                /Button> < /
                div > <
                /CardContent> < /
                Card >
        )
    }

    { /* Contacts List */ } <
    Card className = "bg-white/80 dark:bg-gray-600 backdrop-blur-sm" >
        <
        CardHeader >
        <
        CardTitle className = "flex items-center gap-2" >
        <
        Phone className = "w-5 h-5 text-purple-600" / >
        Your Important Contacts <
        /CardTitle> < /
        CardHeader > <
        CardContent > {
            contacts.length === 0 ? ( <
                div className = "text-center py-8 text-gray-500" >
                <
                Phone className = "w-12 h-12 mx-auto mb-4 text-gray-300" / >
                <
                p > No important contacts added yet. < /p> <
                Button className = "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white mt-4"
                onClick = {
                    () => setIsAddingContact(true)
                } >
                Add Your First Contact <
                /Button> < /
                div >
            ) : ( <
                div className = "space-y-3" > {
                    contacts.map((contact) => ( <
                        div key = { contact.id }
                        className = "flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:hover:bg-gray-500 hover:bg-gray-50 transition-colors" >
                        <
                        div className = "flex items-center gap-4" > { contact.type === "phone" ? < Phone className = "w-5 h-5 text-blue-600" / > : < Globe className = "w-5 h-5 text-green-600" / > } <
                        div >
                        <
                        h4 className = "font-medium flex items-center gap-2" > { contact.name } {
                            contact.category && ( <
                                Badge variant = "outline"
                                className = "bg-purple-100 text-purple-700" > { contact.category } <
                                /Badge>
                            )
                        } <
                        /h4> <
                        p className = "text-sm text-gray-600" > {
                            contact.type === "phone" ? ( <
                                a href = { `tel:${contact.value}` }
                                className = "text-blue-500 hover:underline" > { contact.value } <
                                /a>
                            ) : ( <
                                a href = { contact.value }
                                target = "_blank"
                                rel = "noopener noreferrer"
                                className = "text-green-500 hover:underline" > { contact.value } <
                                /a>
                            )
                        } <
                        /p> {
                        contact.description && < p className = "text-sm text-gray-500 italic" > "{contact.description}" < /p>} < /
                        div > <
                        /div>

                        <
                        div className = "flex gap-2" >
                        <
                        Button size = "sm"
                        variant = "ghost"
                        onClick = {
                            () => setEditingContact(contact)
                        } >
                        <
                        Edit className = "w-4 h-4" / >
                        <
                        /Button> <
                        Button size = "sm"
                        variant = "ghost"
                        onClick = {
                            () => handleDeleteContact(contact.id)
                        }
                        className = "text-red-600 hover:text-red-700" >
                        <
                        Trash2 className = "w-4 h-4" / >
                        <
                        /Button> < /
                        div > <
                        /div>
                    ))
                } <
                /div>
            )
        } <
        /CardContent> < /
        Card > <
        /div>
);
}