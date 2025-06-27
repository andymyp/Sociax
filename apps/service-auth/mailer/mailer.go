package mailer

import (
	"bytes"
	"embed"
	"html/template"
	"log"
	"strconv"

	"gopkg.in/gomail.v2"
)

type DataOTP struct {
	Name string
	OTP  string
}

//go:embed *.html
var templateFS embed.FS

var dialer *gomail.Dialer
var from string

func InitMailer(host, port, user, pass, email string) {
	portInt, _ := strconv.Atoi(port)
	d := gomail.NewDialer(host, portInt, user, pass)
	
	dialer = d
	from = email
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