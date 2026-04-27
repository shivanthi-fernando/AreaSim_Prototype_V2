"use client";

import { useEffect } from "react";
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
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance & Banking" },
  { value: "creative", label: "Creative & Media" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Professional Services" },
  { value: "public", label: "Public" },
  { value: "other", label: "Other" },
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
    setValue,
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

  // Keep the hidden city field in sync with the detected city
  useEffect(() => {
    setValue("city", detectedCity ?? "");
  }, [detectedCity, setValue]);

  const onSubmit = (data: FormValues) => {
    setProject({
      ...data,
      city: detectedCity ?? data.city ?? "",
    });
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

      {/* Postal code — city auto-detected from code and shown inline */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Postal code</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="e.g. 0123"
              className="w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 pr-36 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
              {...register("postalCode")}
            />
            {detectedCity && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-semibold text-accent font-body pointer-events-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {detectedCity}
              </motion.span>
            )}
          </div>
          {errors.postalCode && (
            <p className="text-xs text-accent-warm font-body">{errors.postalCode.message}</p>
          )}
        </div>
      </motion.div>

      {/* Hidden city — populated automatically from postal code */}
      <input type="hidden" {...register("city")} />

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
