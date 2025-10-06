using ByWay.Core.Contracts.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace ByWay.Application.Helpers
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;
        private readonly string _fromName;
        private readonly bool _enableSsl;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;

            _smtpServer = _configuration["Email:SmtpServer"] ?? "smtp.gmail.com";
            _smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            _smtpUsername = _configuration["Email:SmtpUsername"] ?? "";
            _smtpPassword = _configuration["Email:SmtpPassword"] ?? "";
            _fromEmail = _configuration["Email:FromEmail"] ?? "noreply@byway.com";
            _fromName = _configuration["Email:FromName"] ?? "Byway Team";
            _enableSsl = bool.Parse(_configuration["Email:EnableSsl"] ?? "true");
        }

        public async Task SendWelcomeEmailAsync(string email, string firstName)
        {
            var subject = "Welcome aboard 🎉";
            var body = GenerateWelcomeEmailBody(firstName);

            await SendEmailAsync(email, subject, body, isHtml: true);
        }

        public async Task SendPurchaseConfirmationEmailAsync(string email, string firstName, List<string> courseNames)
        {
            var subject = "Thank you for your purchase 🎉";
            var body = GeneratePurchaseConfirmationEmailBody(firstName, courseNames);

            await SendEmailAsync(email, subject, body, isHtml: true);
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            try
            {
                using var smtpClient = new SmtpClient(_smtpServer, _smtpPort);
                smtpClient.EnableSsl = _enableSsl;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_fromEmail, _fromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                mailMessage.To.Add(to);

                await smtpClient.SendMailAsync(mailMessage);

                _logger.LogInformation($"Email sent successfully to {to}");
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, $"SMTP error sending email to {to}: {ex.Message}");
                throw new InvalidOperationException($"Failed to send email: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending email to {to}: {ex.Message}");
                throw;
            }
        }

        private string GenerateWelcomeEmailBody(string firstName)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("    <style>");
            sb.AppendLine("        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine("        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }");
            sb.AppendLine("        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }");
            sb.AppendLine("        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }");
            sb.AppendLine("        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }");
            sb.AppendLine("    </style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("    <div class='container'>");
            sb.AppendLine("        <div class='header'>");
            sb.AppendLine("            <h1>🎉 Welcome to Byway!</h1>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='content'>");
            sb.AppendLine($"            <h2>Hi {firstName}!</h2>");
            sb.AppendLine("            <p>Your learning journey starts here, let's grow your skills together 🎓</p>");
            sb.AppendLine("            <p>We're excited to have you join our community of learners. With Byway, you'll have access to:</p>");
            sb.AppendLine("            <ul>");
            sb.AppendLine("                <li>📚 Hundreds of high-quality courses</li>");
            sb.AppendLine("                <li>👨‍🏫 Expert instructors from around the world</li>");
            sb.AppendLine("                <li>🎯 Personalized learning paths</li>");
            sb.AppendLine("                <li>📱 Learn anytime, anywhere</li>");
            sb.AppendLine("            </ul>");
            sb.AppendLine("            <a href='https://yourwebsite.com/courses' class='button'>Browse Courses</a>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='footer'>");
            sb.AppendLine("            <p>© 2024 Byway. All rights reserved.</p>");
            sb.AppendLine("            <p>If you have any questions, reply to this email or contact support@byway.com</p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }

        private string GeneratePurchaseConfirmationEmailBody(string firstName, List<string> courseNames)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("    <style>");
            sb.AppendLine("        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine("        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }");
            sb.AppendLine("        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }");
            sb.AppendLine("        .course-list { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }");
            sb.AppendLine("        .course-item { padding: 10px 0; border-bottom: 1px solid #eee; }");
            sb.AppendLine("        .course-item:last-child { border-bottom: none; }");
            sb.AppendLine("        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }");
            sb.AppendLine("        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }");
            sb.AppendLine("    </style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("    <div class='container'>");
            sb.AppendLine("        <div class='header'>");
            sb.AppendLine("            <h1>🎉 Thank You for Your Purchase!</h1>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='content'>");
            sb.AppendLine($"            <h2>Hi {firstName}!</h2>");
            sb.AppendLine("            <p>Your courses are now available in your dashboard. Best of luck on your learning journey!</p>");
            sb.AppendLine("            <div class='course-list'>");
            sb.AppendLine("                <h3>Your Purchased Courses:</h3>");

            foreach (var courseName in courseNames)
            {
                sb.AppendLine($"                <div class='course-item'>✅ {courseName}</div>");
            }

            sb.AppendLine("            </div>");
            sb.AppendLine("            <p>You can access all your courses from your dashboard at any time.</p>");
            sb.AppendLine("            <a href='https://yourwebsite.com/dashboard' class='button'>Go to Dashboard</a>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='footer'>");
            sb.AppendLine("            <p>© 2024 Byway. All rights reserved.</p>");
            sb.AppendLine("            <p>Questions? Contact us at support@byway.com</p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }
    }
}