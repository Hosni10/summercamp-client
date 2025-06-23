import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="border-gray-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              404 - Page Not Found
            </CardTitle>
            <p className="text-gray-600 mt-2">
              The page you're looking for doesn't exist
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                What happened?
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• The page may have been moved or deleted</p>
                <p>• You may have typed the wrong URL</p>
                <p>• The link you followed may be broken</p>
              </div>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                What to do next?
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check the URL for typos</li>
                <li>• Go back to the previous page</li>
                <li>• Return to the home page</li>
                <li>• Contact us if you need help</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoHome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home Page
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Contact Information */}
            <div className="text-center text-sm text-gray-600">
              <p>Need help? Contact us at:</p>
              <p className="font-medium">📞 050 333 1468</p>
              <p className="font-medium">✉️ info@atomicsfootball.com</p>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/kids-camp")}
                  className="text-sm"
                >
                  Kids Camp
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/football-clinic")}
                  className="text-sm"
                >
                  Football Clinic
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
