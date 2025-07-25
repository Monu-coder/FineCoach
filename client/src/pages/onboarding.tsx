import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { supportedLanguages } from "@/lib/i18n";
import { GraduationCap, UserPlus } from "lucide-react";
import type { InsertUser } from "@shared/schema";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, setLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    language: "",
    age: "",
    region: "",
    financialGoal: "",
    knowledgeLevel: ""
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: (user) => {
      localStorage.setItem("currentUserId", user.id.toString());
      // Update the app language if user selected a different one
      if (formData.language) {
        setLanguage(formData.language);
      }
      toast({
        title: t("onboarding.title"),
        description: t("dashboard.subtitle"),
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(value => !value)) {
      toast({
        title: t("common.error"),
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(formData);
  };

  const isFormValid = Object.values(formData).every(value => value);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{t("onboarding.title")}</CardTitle>
            <p className="text-gray-600 text-sm">{t("onboarding.subtitle")}</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">{t("onboarding.username")}</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1"
                  placeholder={t("onboarding.username.placeholder")}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t("onboarding.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                  placeholder={t("onboarding.email.placeholder")}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">{t("onboarding.language")}</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("onboarding.language.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">{t("onboarding.age")}</Label>
                <Select value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("onboarding.age.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">{t("age.18-25")}</SelectItem>
                    <SelectItem value="26-35">{t("age.26-35")}</SelectItem>
                    <SelectItem value="36-45">{t("age.36-45")}</SelectItem>
                    <SelectItem value="46+">{t("age.46+")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">{t("onboarding.region")}</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("onboarding.region.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America">{t("region.northamerica")}</SelectItem>
                    <SelectItem value="Europe">{t("region.europe")}</SelectItem>
                    <SelectItem value="Asia-Pacific">{t("region.asiapacific")}</SelectItem>
                    <SelectItem value="Latin America">{t("region.latinamerica")}</SelectItem>
                    <SelectItem value="Africa">{t("region.africa")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">{t("onboarding.goal")}</Label>
                <Select value={formData.financialGoal} onValueChange={(value) => setFormData(prev => ({ ...prev, financialGoal: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("onboarding.goal.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Save for emergency fund">{t("goal.emergency")}</SelectItem>
                    <SelectItem value="Start investing">{t("goal.investing")}</SelectItem>
                    <SelectItem value="Buy a home">{t("goal.home")}</SelectItem>
                    <SelectItem value="Retirement planning">{t("goal.retirement")}</SelectItem>
                    <SelectItem value="Debt management">{t("goal.debt")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">{t("onboarding.knowledge")}</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={formData.knowledgeLevel === level ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setFormData(prev => ({ ...prev, knowledgeLevel: level }))}
                    >
                      {t(`knowledge.${level.toLowerCase()}`)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 h-12 text-base font-medium"
                disabled={!isFormValid || createUserMutation.isPending}
              >
                {createUserMutation.isPending ? (
                  t("onboarding.creating")
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("onboarding.button")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
