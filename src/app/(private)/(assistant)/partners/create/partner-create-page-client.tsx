"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { ASSISTANT_ROUTES } from "@/constants/routes";
import { PageHeader } from "@/components/commons/page-header";
import { PrimaryActionButton } from "@/components/commons/primary-action-button";
import { FormField, FormInput, FormSelect } from "@/components/forms";
import { countries } from "@/features/onboarding/const";
import { toast } from "sonner";
import { useSession } from "@/libs/better-auth/client";
import { useState, startTransition } from "react";
import { usePartnerStoreState } from "@/stores/partner/provider";
import { TPartner } from "@/stores/partner/types";

type SimplifiedPartnerFormData = {
  partnerName: string;
  dob: string; // YYYY-MM-DD format
  socialLink: string;
  country: string;
};

export default function PartnerCreatePageClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addPartner = usePartnerStoreState((state) => state.addPartner);

  const form = useForm({
    defaultValues: {
      partnerName: "",
      dob: "",
      socialLink: "",
      country: "",
    },
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
  });

  const partnerName = useStore(form.store, (state) => state.values.partnerName);
  const errors = useStore(form.store, (state) => state.errors);
  const dob = useStore(form.store, (state) => state.values.dob);
  const country = useStore(form.store, (state) => state.values.country);


  const isFormValid = partnerName && dob && country && Object.keys(errors).length === 0;


  const handleSubmit = async (formData: SimplifiedPartnerFormData) => {
    // Validate required fields
    if (!formData.partnerName.trim()) {
      toast.error("Partner name is required");
      return;
    }
    if (!formData.dob) {
      toast.error("Date of birth is required");
      return;
    }
    if (!formData.country) {
      toast.error("Country is required");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Creating partner profile...");

    try {
      // Mock API call with setTimeout to show loading state
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Calculate age from DOB
      const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      };

      // Generate unique partner_id
      const partnerId = crypto.randomUUID();

      // Build basic_info object
      const basicInfo: TPartner["partner_profile"]["basic_info"] = {
        name: formData.partnerName,
        dob: formData.dob,
        country_of_birth: formData.country,
        age: calculateAge(formData.dob),
      };

      // Add social link if provided
      if (formData.socialLink.trim()) {
        basicInfo.social_link = formData.socialLink;
      }

      // Create partner object matching the expected structure
      const newPartner: TPartner = {
        partner_id: partnerId,
        partner_profile: {
          basic_info: basicInfo,
        },
      };

      // Add partner to Zustand store
      addPartner(newPartner);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success("Partner created successfully");

      // Navigate to partners page with smooth transition
      startTransition(() => {
        router.push(ASSISTANT_ROUTES.PARTNERS);
      });
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      console.error("Failed to create partner:", error);
      toast.error("Failed to create partner", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Create Partner"
        backHref={ASSISTANT_ROUTES.PARTNERS}
      />
      <main className="grow px-6 pb-24 overflow-y-auto flex flex-col items-center">
        <p className="text-center text-text-soft mt-2 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
          Fill up info to analyze the matching of you and partner
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full max-w-md"
        >
          <div className="w-full bg-card-white rounded-[2rem] p-6 shadow-soft space-y-5">
            {/* Partner Name Field */}
            <form.Field
              name="partnerName"
              validators={{
                onChange: ({ value }) => {
                  if (!value || !value.trim()) {
                    return "Partner name is required";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormField
                  label="Partner name"
                  htmlFor="partner-name"
                  error={field.state.meta.errors}
                >
                  <FormInput
                    id="partner-name"
                    name={field.name}
                    type="text"
                    field={field}
                    disabled={isSubmitting}
                    placeholder="Ex. Sarah"
                  />
                </FormField>
              )}
            </form.Field>

            {/* Date of Birth Field */}
            <form.Field
              name="dob"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Date of birth is required";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormField
                  label="DoB"
                  htmlFor="dob"
                  error={field.state.meta.errors}
                >
                  <FormInput
                    id="dob"
                    name={field.name}
                    type="date"
                    field={field}
                    disabled={isSubmitting}
                  />
                </FormField>
              )}
            </form.Field>

            {/* Social Link Field */}
            <form.Field
              name="socialLink"

            >
              {(field) => (
                <FormField
                  label="Social link"
                  htmlFor="social-link"
                  helperText="to know what's your partner like or their vibe"
                  error={field.state.meta.errors}
                >
                  <FormInput
                    id="social-link"
                    name={field.name}
                    type="url"
                    field={field}
                    disabled={isSubmitting}
                    placeholder="Instagram, Twitter, etc."
                  />
                </FormField>
              )}
            </form.Field>

            {/* Country Field */}
            <form.Field
              name="country"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Country is required";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormField
                  label="Country"
                  htmlFor="country"
                  error={field.state.meta.errors}
                >
                  <FormSelect
                    field={field}
                    options={countries}
                    placeholder="Select country"
                    disabled={isSubmitting}
                  />
                </FormField>
              )}
            </form.Field>
          </div>

          {/* Submit Button */}
          <div className="w-full mt-8 mb-4">
            <PrimaryActionButton
              type="submit"
              disabled={isSubmitting || !isFormValid}
              label={isSubmitting ? "Creating..." : "Create Profile"}
              className="size-full"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
