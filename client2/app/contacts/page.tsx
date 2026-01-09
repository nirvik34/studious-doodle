"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { emergencyContacts } from "@/lib/storage";
import { EmergencyContact } from "@/lib/types";
import { Phone, Plus, Edit, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function EmergencyContactsPage() {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        phone: string;
        relationship: "family" | "friend" | "caregiver" | "doctor" | "other";
    }>({
        name: "",
        phone: "",
        relationship: "family",
    });

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = () => {
        const allContacts = emergencyContacts.getAll();
        setContacts(allContacts);
    };

    const handleAdd = () => {
        if (!formData.name || !formData.phone) {
            toast.error("Please fill in all fields");
            return;
        }

        emergencyContacts.add({
            name: formData.name,
            phone: formData.phone,
            relationship: formData.relationship,
            isPrimary: contacts.length === 0, // First contact is primary by default
        });

        toast.success("Emergency contact added");
        loadContacts();
        setIsAddDialogOpen(false);
        setFormData({ name: "", phone: "", relationship: "family" });
    };

    const handleEdit = () => {
        if (!editingContact || !formData.name || !formData.phone) {
            toast.error("Please fill in all fields");
            return;
        }

        emergencyContacts.update(editingContact.id, {
            name: formData.name,
            phone: formData.phone,
            relationship: formData.relationship,
        });

        toast.success("Contact updated");
        loadContacts();
        setIsEditDialogOpen(false);
        setEditingContact(null);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this contact?")) {
            emergencyContacts.remove(id);
            toast.success("Contact deleted");
            loadContacts();
        }
    };

    const handleSetPrimary = (contact: EmergencyContact) => {
        // Remove primary from all contacts
        contacts.forEach((c) => {
            if (c.isPrimary) {
                emergencyContacts.update(c.id, { isPrimary: false });
            }
        });

        // Set this one as primary
        emergencyContacts.update(contact.id, { isPrimary: true });
        toast.success(`${contact.name} set as primary contact`);
        loadContacts();
    };

    const openEditDialog = (contact: EmergencyContact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship,
        });
        setIsEditDialogOpen(true);
    };

    const openAddDialog = () => {
        setFormData({ name: "", phone: "", relationship: "family" });
        setIsAddDialogOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Emergency Contacts</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your emergency contact list for quick access during critical situations
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Emergency Contact</DialogTitle>
                            <DialogDescription>
                                Add a new emergency contact to your list
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div>
                                <Label htmlFor="relationship">Relationship</Label>
                                <Select
                                    value={formData.relationship}
                                    onValueChange={(value: any) =>
                                        setFormData({ ...formData, relationship: value })
                                    }
                                >
                                    <SelectTrigger id="relationship">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="family">Family</SelectItem>
                                        <SelectItem value="friend">Friend</SelectItem>
                                        <SelectItem value="caregiver">Caregiver</SelectItem>
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleAdd} className="w-full">
                                Add Contact
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {contacts.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">No emergency contacts yet</p>
                        <p className="text-muted-foreground text-center mb-4">
                            Add your first emergency contact to get started
                        </p>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Contact
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {contacts.map((contact) => (
                        <Card key={contact.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {contact.name}
                                            {contact.isPrimary && (
                                                <Badge variant="default" className="gap-1">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    Primary
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground capitalize mt-1">
                                            {contact.relationship}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${contact.phone}`} className="hover:underline">
                                        {contact.phone}
                                    </a>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <a href={`tel:${contact.phone}`}>
                                            <Phone className="h-3 w-3 mr-1" />
                                            Call
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(contact)}
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    {!contact.isPrimary && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSetPrimary(contact)}
                                            title="Set as primary"
                                        >
                                            <Star className="h-3 w-3" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(contact.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Emergency Contact</DialogTitle>
                        <DialogDescription>
                            Update the contact information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input
                                id="edit-phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-relationship">Relationship</Label>
                            <Select
                                value={formData.relationship}
                                onValueChange={(value: any) =>
                                    setFormData({ ...formData, relationship: value })
                                }
                            >
                                <SelectTrigger id="edit-relationship">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="family">Family</SelectItem>
                                    <SelectItem value="friend">Friend</SelectItem>
                                    <SelectItem value="caregiver">Caregiver</SelectItem>
                                    <SelectItem value="doctor">Doctor</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleEdit} className="w-full">
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
