package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	MODE     string `mapstructure:"MODE"`
	DB_URL   string `mapstructure:"DB_URL"`
	HTTPPort string `mapstructure:"HTTP_PORT"`
}

func LoadConfig() (*Config, error) {
	viper.SetConfigFile("./config/config.yaml")
	// viper.SetConfigFile("/go/src/app/config/config.yaml")

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var Config Config
	if err := viper.Unmarshal(&Config); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	log.Printf("Config: %+v", Config)

	return &Config, nil
}
