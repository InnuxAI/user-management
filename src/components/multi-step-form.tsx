import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

const multiStepFormVariants = cva(
  "flex flex-col w-full",
  {
    variants: {
      size: {
        default: "w-full",
        sm: "w-full",
        lg: "w-full",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface MultiStepFormProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof multiStepFormVariants> {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onBack: () => void;
  onNext: () => void;
  onClose?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  footerContent?: React.ReactNode;
}

const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  ({
    className,
    size,
    currentStep,
    totalSteps,
    title,
    description,
    onBack,
    onNext,
    onClose,
    backButtonText = "Back",
    nextButtonText = "Next Step",
    footerContent,
    children,
    ...props
  }, ref) => {
    const progress = Math.round((currentStep / totalSteps) * 100);

    const variants = {
      hidden: { opacity: 0, x: 100 },
      enter: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    };

    return (
      <Card ref={ref} className={cn(multiStepFormVariants({ size }), className)} {...props}>
        <CardHeader className="pb-6 px-8 pt-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-semibold">{title}</CardTitle>
              <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="shrink-0 -mt-1">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground whitespace-nowrap font-medium">
              {currentStep}/{totalSteps} completed
            </p>
          </div>
        </CardHeader>

        <CardContent className="min-h-[400px] px-8 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between px-8 py-6 bg-muted/20 border-t">
          <div className="flex items-center">{footerContent}</div>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={onBack} className="px-6">
                {backButtonText}
              </Button>
            )}
            <Button onClick={onNext} className="px-6">
              {nextButtonText}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
);

MultiStepForm.displayName = "MultiStepForm";

export { MultiStepForm };