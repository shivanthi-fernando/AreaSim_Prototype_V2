"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore, LeaseParams } from "@/store/onboarding";
import { formatNumber } from "@/lib/utils";

const schema = z.object({
  totalArea: z.string().min(1, "Total area is required"),
  annualRent: z.string().min(1, "Annual rent is required"),
  commonAreaCost: z.string().min(1, "Common area cost is required"),
  targetHeadcount: z.number().min(1, "At least 1 employee required"),
  consultantsCount: z.number().optional(),
  showConsultants: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3Lease({ onNext, onBack }: Props) {
  const { leaseParams, setLeaseParams } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      totalArea: leaseParams.totalArea || "",
      annualRent: leaseParams.annualRent || "",
      commonAreaCost: leaseParams.commonAreaCost || "",
      targetHeadcount: leaseParams.targetHeadcount || 1,
      consultantsCount: leaseParams.consultantsCount || 0,
      showConsultants: leaseParams.showConsultants || false,
    },
  });

  const employees = watch("targetHeadcount");
  const consultants = watch("consultantsCount") || 0;
  const showConsultants = watch("showConsultants");
  const effectiveTotal = employees + (showConsultants ? consultants * 0.5 : 0);

  const onSubmit = (data: FormValues) => {
    setLeaseParams(data as LeaseParams);
    onNext();
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <motion.form
      variants={stagger}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <motion.div variants={item} className="pb-2">
        <p className="text-sm font-medium text-accent bg-accent/5 px-4 py-2.5 rounded-xl border border-accent/10">
          Here we want you to add current lease agreements.
        </p>
      </motion.div>

      {/* Total area */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Total area (sqft)</label>
          <div className="relative">
            <input
              type="number"
              placeholder="e.g. 10,000"
              className="w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 pr-14 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
              {...register("totalArea")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-mono">
              Sqft
            </span>
          </div>
          {errors.totalArea && <p className="text-xs text-accent-warm font-body">{errors.totalArea.message}</p>}
        </div>
      </motion.div>

      {/* Annual rent */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Annual rent cost</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted font-mono pointer-events-none">
              Nok
            </span>
            <input
              type="number"
              placeholder="e.g. 2,500,000"
              className="w-full rounded-[10px] border border-border bg-surface pl-14 pr-4 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
              {...register("annualRent")}
            />
          </div>
          {errors.annualRent && <p className="text-xs text-accent-warm font-body">{errors.annualRent.message}</p>}
        </div>
      </motion.div>

      {/* Common area cost */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Common area cost</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted font-mono pointer-events-none">
              Nok
            </span>
            <input
              type="number"
              placeholder="e.g. 400,000"
              className="w-full rounded-[10px] border border-border bg-surface pl-14 pr-4 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
              {...register("commonAreaCost")}
            />
          </div>
          {errors.commonAreaCost && <p className="text-xs text-accent-warm font-body">{errors.commonAreaCost.message}</p>}
        </div>
      </motion.div>

      {/* Number of employees */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Number of employees</label>
          <div className="relative">
            <input
              type="number"
              min={1}
              placeholder="e.g. 50"
              className="w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 pr-16 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
              value={employees || ""}
              onChange={(e) => setValue("targetHeadcount", Math.max(1, parseInt(e.target.value) || 1))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-body pointer-events-none">
              People
            </span>
          </div>
          {errors.targetHeadcount && <p className="text-xs text-accent-warm font-body">{errors.targetHeadcount.message}</p>}
        </div>
      </motion.div>

      {/* Consultants checkbox */}
      <motion.div variants={item} className="flex items-center gap-2.5 pt-1">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id="showConsultants"
            className="peer w-4 h-4 rounded border-border cursor-pointer appearance-none border-2 border-border bg-surface checked:bg-primary checked:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("showConsultants")}
          />
          <svg
            className="absolute inset-0 w-4 h-4 text-white pointer-events-none hidden peer-checked:block"
            viewBox="0 0 16 16" fill="none"
          >
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <label htmlFor="showConsultants" className="text-sm font-medium text-text font-body cursor-pointer">
          Consultants
        </label>
      </motion.div>

      {/* Number of consultants (conditional) */}
      {showConsultants && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text font-body">Number of consultants</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                placeholder="e.g. 10"
                className="w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 pr-24 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                {...register("consultantsCount", { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-body pointer-events-none">
                Consultants
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {showConsultants && (
        <motion.div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs font-medium text-primary font-body">
            Your total number of employees is <span className="font-semibold">{formatNumber(effectiveTotal)}</span>
          </p>
          <p className="text-[10px] text-text-muted mt-0.5">
            (1 Consultant = 0.5 employee in space calculation)
          </p>
        </motion.div>
      )}

      {/* Additional agreements upload */}
      <motion.div variants={item} className="space-y-1.5 pt-4">
        <label className="text-sm font-medium text-text font-body">
          Add additional agreements (e.g. parking, storage)
        </label>
        <label className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload size={20} className="text-text-muted" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text">Click to upload PDFs</p>
            <p className="text-xs text-text-muted mt-0.5">or drag and drop files here</p>
          </div>
          <input type="file" className="hidden" accept=".pdf" multiple />
        </label>
      </motion.div>

      <motion.div variants={item} className="flex gap-3 pt-6 border-t border-border">
        <Button variant="secondary" size="lg" type="button" className="flex-1 items-center justify-center" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button size="lg" type="submit" className="flex-1 items-center justify-center" icon={<ArrowRight size={16} />} iconPosition="right">
          Continue
        </Button>
      </motion.div>
    </motion.form>
  );
}
