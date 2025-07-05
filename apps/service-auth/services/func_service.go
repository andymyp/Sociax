package services

import (
	"fmt"
	"math/rand"
	"regexp"
	"strings"
)

func (s *services) GenerateUniqueUsername(email string) (string, error) {
	local := strings.Split(email, "@")[0]
	re := regexp.MustCompile("[^a-zA-Z0-9]+")
	base := re.ReplaceAllString(local, "")
	base = strings.ToLower(base)

	if len(base) < 3 {
		base = fmt.Sprintf("%s%03d", base, rand.Intn(1000))
	}

	maxBaseLen := 20
	if len(base) > maxBaseLen {
		base = base[:maxBaseLen]
	}

	usernames, err := s.repo.GetUsernames(base)
	if err != nil {
		return "", err
	}

	used := make(map[string]bool)
	for _, u := range usernames {
		used[u] = true
	}

	if !used[base] {
		return base, nil
	}

	for i := 1; i < 1000; i++ {
		suffix := fmt.Sprintf("%03d", i)
		candidate := base
		if len(base)+3 > 20 {
			candidate = base[:20-3] + suffix
		} else {
			candidate += suffix
		}
		if !used[candidate] {
			return candidate, nil
		}
	}

	return "", fmt.Errorf("no available username for base %s", base)
}
