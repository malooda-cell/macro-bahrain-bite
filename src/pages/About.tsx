import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary border-b border-border/20 p-8 shadow-soft">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4 text-muted-foreground hover:bg-muted rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-3">About Macro Fireej</h1>
        <p className="text-muted-foreground text-lg">App information and privacy details</p>
      </div>

      <div className="p-6 space-y-6">
        {/* App Purpose */}
        <Card className="bg-white border-border/40 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              App Purpose
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              Macro Fireej is a nutrition tracking app designed specifically for Bahrain's cafeteria ecosystem. 
              It helps health-conscious users discover healthy cafeterias, track their macro nutrients, and make 
              informed dietary choices across the kingdom's dining options.
            </p>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="bg-white border-border/40 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed">
                All restaurant and dish data has been carefully curated and seeded from comprehensive 
                spreadsheet research of Bahrain's cafeteria landscape.
              </p>
              <Badge variant="secondary" className="rounded-full">
                Data Source: Curated Spreadsheet Research
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <Card className="bg-white border-border/40 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy & Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Your privacy is our priority. We maintain a minimal data footprint:
              </p>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span>
                  <span><strong>Email Address:</strong> Used solely for account authentication and sign-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span>
                  <span><strong>Meal Logs:</strong> Your nutrition tracking data is stored securely and privately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span>
                  <span><strong>No Sensitive Data:</strong> We do not collect personal information, location data, or any other sensitive information</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  🔒 All data is encrypted and protected by industry-standard security measures
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version Info */}
        <Card className="bg-white border-border/40 rounded-2xl">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Version 1.0.0</p>
              <p className="text-xs mt-1">Built with ❤️ for Bahrain's health-conscious community</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}