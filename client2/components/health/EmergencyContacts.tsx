"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Plus, Trash2, UserPlus } from "lucide-react";

interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
}

export function EmergencyContacts() {
    const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('emergencyContacts');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });

    const saveContacts = (updatedContacts: EmergencyContact[]) => {
        setContacts(updatedContacts);
        localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
    };

    const addContact = () => {
        if (newContact.name && newContact.phone) {
            const contact: EmergencyContact = {
                id: Date.now().toString(),
                ...newContact
            };
            saveContacts([...contacts, contact]);
            setNewContact({ name: "", phone: "", relationship: "" });
            setShowAddForm(false);
        }
    };

    const deleteContact = (id: string) => {
        saveContacts(contacts.filter(c => c.id !== id));
    };

    const callContact = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    return (
        <Card className="border-2 border-red-100">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-red-600" />
                        Emergency
                    </span>
                    <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="h-8"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* 911 Quick Dial */}
                <Button 
                    onClick={() => window.location.href = "tel:911"}
                    className="w-full bg-red-600 hover:bg-red-700 h-12"
                >
                    <Phone className="h-5 w-5 mr-2" />
                    Call 911
                </Button>

                {showAddForm && (
                    <div className="space-y-2 p-3 border rounded-lg bg-red-50">
                        <Input
                            placeholder="Name"
                            value={newContact.name}
                            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                            className="h-9"
                        />
                        <Input
                            placeholder="Phone"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                            className="h-9"
                        />
                        <Input
                            placeholder="Relationship"
                            value={newContact.relationship}
                            onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                            className="h-9"
                        />
                        <div className="flex gap-2">
                            <Button onClick={addContact} className="flex-1 h-8" size="sm">
                                Save
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm" className="h-8">
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {contacts.length > 0 ? (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Your Contacts</p>
                        {contacts.map(contact => (
                            <div key={contact.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{contact.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {contact.phone}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => callContact(contact.phone)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => deleteContact(contact.id)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !showAddForm && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                            No contacts added
                        </p>
                    )
                )}
            </CardContent>
        </Card>
    );
}
