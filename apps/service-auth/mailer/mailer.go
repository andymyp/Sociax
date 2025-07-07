package mailer

import (
	"bytes"
	"embed"
	"html/template"
	"log"

	"gopkg.in/gomail.v2"
)

//go:embed *.html
var templateFS embed.FS

var dialer *gomail.Dialer
var from string

type Config struct {
	Host  string
	Port  int
	User  string
	Pass  string
	Email string
}

type DataOTP struct {
	Name string
	OTP  string
}

func InitMailer(cfg Config) {
	d := gomail.NewDialer(cfg.Host, cfg.Port, cfg.User, cfg.Pass)

	dialer = d
	from = cfg.Email
}

func SendEmailOTP(to string, data DataOTP) {
	tmplContent, err := templateFS.ReadFile("send_otp.html")
	if err != nil {
		log.Println("mailer error: " + err.Error())
		return
	}

	t, err := template.New("send_otp").Parse(string(tmplContent))
	if err != nil {
		log.Println("mailer error: " + err.Error())
		return
	}

	var body bytes.Buffer
	if err := t.Execute(&body, data); err != nil {
		log.Println("mailer error: " + err.Error())
		return
	}

	m := gomail.NewMessage()
	m.SetHeader("From", `"Sociax Verify" <`+from+`>`)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Your Sociax Verify OTP")
	m.SetBody("text/html", body.String())

	dialer.DialAndSend(m)
}
