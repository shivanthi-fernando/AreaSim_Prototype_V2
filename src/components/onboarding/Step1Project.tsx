"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore } from "@/store/onboarding";
import { getCityFromPostalCode } from "@/lib/postalCodes";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  projectName: z.string().min(2, "Project name is required"),
  officeAddress: z.string().min(1, "Office address is required"),
  city: z.string(),
  postalCode: z.string().min(4, "Postal code is required"),
  category: z.string().min(1, "Please select a category"),
  industry: z.string().min(1, "Please select an industry"),
});

type FormValues = z.infer<typeof schema>;

const categories = [
  { value: "office", label: "Office" },
  { value: "coworking", label: "Co-working" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const industries = [
  { value: "real-estate",   label: "Real Estate & Property" },
  { value: "oil-gas",       label: "Oil & Gas / Energy" },
  { value: "construction",  label: "Construction & Engineering" },
  { value: "technology",    label: "Technology / IT Services" },
  { value: "finance",       label: "Finance & Banking" },
  { value: "insurance",     label: "Insurance" },
  { value: "public",        label: "Public Sector / Government" },
  { value: "healthcare",    label: "Healthcare & Life Sciences" },
  { value: "retail",        label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing / Industrial" },
  { value: "shipping",      label: "Shipping & Maritime" },
  { value: "consulting",    label: "Consulting / Professional Services" },
  { value: "education",     label: "Education" },
  { value: "media",         label: "Media & Communication" },
  { value: "hospitality",   label: "Hospitality & Tourism" },
  { value: "other",         label: "Other - Ved samlokalisering" },
];

interface Props {
  onNext: () => void;
}

export function Step1Project({ onNext }: Props) {
  const { project, setProject } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectName: project.projectName || "",
      officeAddress: project.officeAddress || "",
      city: project.city || "",
      postalCode: project.postalCode || "",
      category: project.category || "",
      industry: project.industry || "",
    },
  });

  const postalCode = watch("postalCode");
  const detectedCity = getCityFromPostalCode(postalCode || "");

  const onSubmit = (data: FormValues) => {
    setProject(data);
    onNext();
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.form
      variants={stagger}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <motion.div variants={item}>
        <Input
          label="Project name"
          placeholder="Oslo HQ optimisation"
          error={errors.projectName?.message}
          {...register("projectName")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Input
          label="Office address"
          placeholder="Aker Brygge Tower, Oslo"
          error={errors.officeAddress?.message}
          {...register("officeAddress")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Input
          label="City"
          placeholder="Oslo"
          error={errors.city?.message}
          {...register("city")}
        />
      </motion.div>

      {/* Postal code — city auto-detected and shown inline after a comma */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Postal code</label>
          <div
            className="flex items-center w-full rounded-[10px] border border-border bg-surface transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 hover:border-primary/50 overflow-hidden"
          >
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="e.g. 0123"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 focus:outline-none min-w-0"
              {...register("postalCode")}
            />
            {detectedCity && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="pr-4 text-sm text-text-muted font-body whitespace-nowrap shrink-0 pointer-events-none"
              >
                , {detectedCity}
              </motion.span>
            )}
          </div>
          {errors.postalCode && (
            <p className="text-xs text-accent-warm font-body">{errors.postalCode.message}</p>
          )}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Select
          label="Building category"
          options={categories}
          placeholder="Select a category…"
          error={errors.category?.message}
          {...register("category")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Select
          label="Industry"
          options={industries}
          placeholder="Select an industry…"
          error={errors.industry?.message}
          {...register("industry")}
        />
      </motion.div>

      <motion.div variants={item} className="pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Continue
        </Button>
      </motion.div>
    </motion.form>
  );
}
