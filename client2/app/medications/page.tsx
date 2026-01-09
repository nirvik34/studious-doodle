"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { medications } from "@/lib/storage";
import { medicationReminders } from "@/lib/notifications";
import { Medication } from "@/lib/types";
import { Pill, Plus, Edit, Trash2, Bell, BellOff, Clock } from "lucide-react";
import { toast } from "sonner";

export default function MedicationsPage() {
    const [meds, setMeds] = useState<Medication[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingMed, setEditingMed] = useState<Medication | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        frequency: "",
        time: ["09:00"],
        reminderEnabled: true,
    });

    useEffect(() => {
        loadMedications();
    }, []);

    const loadMedications = () => {
        const allMeds = medications.getAll();
        setMeds(allMeds);
    };

    const handleAdd = () => {
        if (!formData.name || !formData.dosage || !formData.frequency) {
            toast.error("Please fill in all required fields");
            return;
        }

        const newMed = medications.add({
            name: formData.name,
            dosage: formData.dosage,
            frequency: formData.frequency,
            time: formData.time,
            reminderEnabled: formData.reminderEnabled,
            startDate: new Date().toISOString(),
        });

        // Schedule reminders if enabled
        if (formData.reminderEnabled) {
            formData.time.forEach(time => {
                medicationReminders.schedule(newMed.id, newMed.name, time);
            });
        }

        toast.success("Medication added");
        loadMedications();
        setIsAddDialogOpen(false);
        resetForm();
    };

    const handleEdit = () => {
        if (!editingMed || !formData.name || !formData.dosage || !formData.frequency) {
            toast.error("Please fill in all required fields");
            return;
        }

        medications.update(editingMed.id, {
            name: formData.name,
            dosage: formData.dosage,
            frequency: formData.frequency,
            time: formData.time,
            reminderEnabled: formData.reminderEnabled,
        });

        // Update reminders
        medicationReminders.cancel(editingMed.id);
        if (formData.reminderEnabled) {
            const updated = medications.getAll().find((m) => m.id === editingMed.id);
            if (updated) {
                updated.time.forEach(time => {
                    medicationReminders.schedule(updated.id, updated.name, time);
                });
            }
        }

        toast.success("Medication updated");
        loadMedications();
        setIsEditDialogOpen(false);
        setEditingMed(null);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this medication?")) {
            medicationReminders.cancel(id);
            medications.remove(id);
            toast.success("Medication deleted");
            loadMedications();
        }
    };

    const handleToggleReminder = (med: Medication) => {
        const newReminderState = !med.reminderEnabled;
        medications.update(med.id, { reminderEnabled: newReminderState });

        if (newReminderState) {
            med.time.forEach(time => {
                medicationReminders.schedule(med.id, med.name, time);
            });
            toast.success(`Reminders enabled for ${med.name}`);
        } else {
            medicationReminders.cancel(med.id);
            toast.success(`Reminders disabled for ${med.name}`);
        }

        loadMedications();
    };

    const resetForm = () => {
        setFormData({
            name: "",
            dosage: "",
            frequency: "",
            time: ["09:00"],
            reminderEnabled: true,
        });
    };

    const openEditDialog = (med: Medication) => {
        setEditingMed(med);
        setFormData({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            time: med.time,
            reminderEnabled: med.reminderEnabled,
        });
        setIsEditDialogOpen(true);
    };

    const openAddDialog = () => {
        resetForm();
        setIsAddDialogOpen(true);
    };

    const activeMeds = medications.getActive();
    const inactiveMeds = meds.filter((m) => m.endDate && new Date(m.endDate) < new Date());

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Medications</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your medications and set reminders
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Medication
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Medication</DialogTitle>
                            <DialogDescription>
                                Add a new medication to your list
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Medication Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Aspirin"
                                />
                            </div>
                            <div>
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input
                                    id="dosage"
                                    value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                    placeholder="100mg"
                                />
                            </div>
                            <div>
                                <Label htmlFor="frequency">Frequency</Label>
                                <Input
                                    id="frequency"
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    placeholder="Once daily"
                                />
                            </div>
                            <div>
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time[0]}
                                    onChange={(e) => setFormData({ ...formData, time: [e.target.value] })}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="reminder"
                                    checked={formData.reminderEnabled}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, reminderEnabled: checked as boolean })
                                    }
                                />
                                <Label htmlFor="reminder" className="cursor-pointer">
                                    Enable reminders
                                </Label>
                            </div>
                            <Button onClick={handleAdd} className="w-full">
                                Add Medication
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {meds.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Pill className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">No medications yet</p>
                        <p className="text-muted-foreground text-center mb-4">
                            Add your first medication to start tracking
                        </p>
                        <Button onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Medication
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {activeMeds.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Active Medications</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {activeMeds.map((med) => (
                                    <Card key={med.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg">{med.name}</CardTitle>
                                                {med.reminderEnabled ? (
                                                    <Badge variant="default" className="gap-1">
                                                        <Bell className="h-3 w-3" />
                                                        On
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="gap-1">
                                                        <BellOff className="h-3 w-3" />
                                                        Off
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Dosage:</span>
                                                    <span className="font-medium">{med.dosage}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Frequency:</span>
                                                    <span className="font-medium">{med.frequency}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Times:</span>
                                                    <span className="font-medium">
                                                        {med.time.join(", ")}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleToggleReminder(med)}
                                                >
                                                    {med.reminderEnabled ? (
                                                        <>
                                                            <BellOff className="h-3 w-3 mr-1" />
                                                            Disable
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bell className="h-3 w-3 mr-1" />
                                                            Enable
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(med)}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(med.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {inactiveMeds.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
                                Past Medications
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-60">
                                {inactiveMeds.map((med) => (
                                    <Card key={med.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{med.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Ended: {med.endDate && new Date(med.endDate).toLocaleDateString()}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Medication</DialogTitle>
                        <DialogDescription>
                            Update medication information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Medication Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-dosage">Dosage</Label>
                            <Input
                                id="edit-dosage"
                                value={formData.dosage}
                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-frequency">Frequency</Label>
                            <Input
                                id="edit-frequency"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-time">Time</Label>
                            <Input
                                id="edit-time"
                                type="time"
                                value={formData.time[0]}
                                onChange={(e) => setFormData({ ...formData, time: [e.target.value] })}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="edit-reminder"
                                checked={formData.reminderEnabled}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, reminderEnabled: checked as boolean })
                                }
                            />
                            <Label htmlFor="edit-reminder" className="cursor-pointer">
                                Enable reminders
                            </Label>
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
