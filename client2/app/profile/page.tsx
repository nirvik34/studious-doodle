"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/resolver";
import { profileSchema, ProfileInput } from "@/lib/validators";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";

const STEPS = [
  { id: 1, title: "Basic Information", fields: ["age", "gender"] },
  { id: 2, title: "Vitals", fields: ["systolicBP", "diastolicBP", "bmi"] },
  {
    id: 3,
    title: "Medical History",
    fields: ["hasHypertension", "hasHeartDisease", "hasDiabetes"],
  },
  { id: 4, title: "Lifestyle", fields: ["smokingStatus", "activityLevel"] },
  { id: 5, title: "Review", fields: [] },
];

export default function ProfileWizard() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signOut } = useAuth() as any;

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      age: 45,
      gender: "male",
      systolicBP: 120,
      diastolicBP: 80,
      bmi: 24,
      hasHypertension: false,
      hasHeartDisease: false,
      hasDiabetes: false,
      smokingStatus: "never",
      activityLevel: "moderate",
    },
    mode: "onChange",
  });

  const nextStep = async () => {
    const fields = STEPS[step - 1].fields as any[];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep((s) => Math.min(s + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  async function onSubmit(data: ProfileInput) {
    setIsSubmitting(true);
    try {
      await api.profile.update(data);
      toast.success("Profile Updated", {
        description: "Your medical profile has been saved.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Update Failed", {
        description: "Could not save profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RequireAuth>
      <div className="container max-w-2xl py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as {user?.displayName || user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`text-sm font-medium ${
                  step >= s.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Step {s.id}
              </div>
            ))}
          </div>
          <div className="h-2 bg-secondary rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step - 1].title}</CardTitle>
            <CardDescription>
              Please provide accurate information for better risk assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 1 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="systolicBP"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Systolic Blood Pressure (mmHg)
                              </FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-4">
                                  <Slider
                                    min={70}
                                    max={250}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) =>
                                      field.onChange(vals[0])
                                    }
                                    className="flex-1"
                                  />
                                  <Input
                                    type="number"
                                    {...field}
                                    className="w-20"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="diastolicBP"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Diastolic Blood Pressure (mmHg)
                              </FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-4">
                                  <Slider
                                    min={40}
                                    max={150}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) =>
                                      field.onChange(vals[0])
                                    }
                                    className="flex-1"
                                  />
                                  <Input
                                    type="number"
                                    {...field}
                                    className="w-20"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bmi"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>BMI</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="hasHypertension"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Hypertension (High Blood Pressure)
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hasHeartDisease"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Heart Disease</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hasDiabetes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Diabetes</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="smokingStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Smoking Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="never">
                                    Never Smoked
                                  </SelectItem>
                                  <SelectItem value="former">
                                    Former Smoker
                                  </SelectItem>
                                  <SelectItem value="current">
                                    Current Smoker
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="activityLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity Level</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sedentary">
                                    Sedentary
                                  </SelectItem>
                                  <SelectItem value="moderate">
                                    Moderate
                                  </SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-4">
                        <div className="rounded-md bg-muted p-4">
                          <h3 className="font-medium mb-2">Summary</h3>
                          <dl className="grid grid-cols-2 gap-2 text-sm">
                            <dt>Age:</dt>
                            <dd>{form.getValues("age")}</dd>
                            <dt>Gender:</dt>
                            <dd>{form.getValues("gender")}</dd>
                            <dt>BP:</dt>
                            <dd>
                              {form.getValues("systolicBP")}/
                              {form.getValues("diastolicBP")}
                            </dd>
                            <dt>BMI:</dt>
                            <dd>{form.getValues("bmi")}</dd>
                            <dt>Conditions:</dt>
                            <dd>
                              {[
                                form.getValues("hasHypertension") &&
                                  "Hypertension",
                                form.getValues("hasHeartDisease") &&
                                  "Heart Disease",
                                form.getValues("hasDiabetes") && "Diabetes",
                              ]
                                .filter(Boolean)
                                .join(", ") || "None"}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1 || isSubmitting}
                  >
                    Previous
                  </Button>

                  {step < 5 ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Profile"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
